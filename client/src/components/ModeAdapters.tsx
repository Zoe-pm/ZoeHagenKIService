import { useState, useRef } from 'react';
import { TestChatbot } from './TestChatbot';
import { TestChatBubbleButton } from './TestChatBubbleButton';

/**
 * Configuration Mode for the Playground System
 */
export type ConfigMode = 'local' | 'vapi';

/**
 * Abstract interface for mode adapters
 */
export interface IModeAdapter {
  mode: ConfigMode;
  
  // Chat functionality
  renderChatInterface: (config: any, onClose: () => void) => React.ReactNode;
  handleSendMessage: (message: string, config: any) => Promise<string>;
  
  // Voice functionality
  renderVoiceInterface: (config: any, onClose: () => void) => React.ReactNode;
  handleVoiceInput: (config: any) => Promise<void>;
  handleTextToSpeech: (text: string, config: any) => Promise<void>;
  
  // Widget visibility and behavior
  getBubbleButton: (config: any, onClick: () => void, isVisible: boolean) => React.ReactNode;
  isAvailable: () => boolean;
  getDisplayName: () => string;
  getDescription: () => string;
}

/**
 * Local Mode Adapter - Uses Web Speech API and local processing
 */
export class LocalModeAdapter implements IModeAdapter {
  mode: ConfigMode = 'local';
  
  private speechSynthesis: SpeechSynthesis | null = null;
  private speechRecognition: any = null;

  constructor() {
    // Initialize Web Speech API if available
    if (typeof window !== 'undefined') {
      this.speechSynthesis = window.speechSynthesis || null;
      
      // Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = 'de-DE';
      }
    }
  }

  renderChatInterface(config: any, onClose: () => void): React.ReactNode {
    // Return existing TestChatbot with local processing

    return <TestChatbot 
      isOpen={true}
      onClose={onClose}
      config={config}
      mode="fixed"
      processingMode="local"
    />;
  }

  async handleSendMessage(message: string, config: any): Promise<string> {
    // Local processing - simple echo with bot name
    const botName = config.activeBot === 'chatbot' ? config.chatbot.name : config.voicebot.name;
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    return `Hallo! Ich bin ${botName} im Lokal-Modus. Ihre Nachricht war: "${message}". Dies ist eine Vorschau mit lokaler Browser-Technologie.`;
  }

  renderVoiceInterface(config: any, onClose: () => void): React.ReactNode {
    // Return existing TestChatbot configured for voice with local processing

    return <TestChatbot 
      isOpen={true}
      onClose={onClose}
      config={config}
      mode="fixed"
      processingMode="local"
    />;
  }

  async handleVoiceInput(config: any): Promise<void> {
    if (!this.speechRecognition) {
      throw new Error('Speech Recognition nicht verfügbar in diesem Browser');
    }

    return new Promise((resolve, reject) => {
      this.speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.speechRecognition.onerror = (event: any) => {
        reject(new Error(`Spracherkennung-Fehler: ${event.error}`));
      };

      this.speechRecognition.start();
    });
  }

  async handleTextToSpeech(text: string, config: any): Promise<void> {
    if (!this.speechSynthesis) {
      throw new Error('Speech Synthesis nicht verfügbar in diesem Browser');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice based on config
      if (config.voicebot?.voiceSpeed?.[0]) {
        utterance.rate = config.voicebot.voiceSpeed[0];
      }
      if (config.voicebot?.voicePitch?.[0]) {
        utterance.pitch = config.voicebot.voicePitch[0];
      }
      
      utterance.lang = 'de-DE';
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS-Fehler: ${event.error || 'Unbekannter Fehler'}`));
      
      this.speechSynthesis!.speak(utterance);
    });
  }

  getBubbleButton(config: any, onClick: () => void, isVisible: boolean): React.ReactNode {
    // Return existing TestChatBubbleButton

    return <TestChatBubbleButton 
      config={config}
      onClick={onClick}
      isVisible={isVisible}
      data-testid="bubble-local-mode"
    />;
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  getDisplayName(): string {
    return 'Lokal (Web Speech API)';
  }

  getDescription(): string {
    return 'Nutzt Browser-Speech API für schnelle Tests';
  }
}

/**
 * Vapi Widget Mode Adapter - Uses real Vapi integration
 */
export class VapiWidgetModeAdapter implements IModeAdapter {
  mode: ConfigMode = 'vapi';
  
  private vapiPublicKey: string | null = null;
  private vapiAssistantId: string | null = null;
  private vapi: any = null;
  private isVapiLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    // Get Vapi credentials from env
    if (typeof window !== 'undefined') {
      this.vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || null;
      this.vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || null;
    }
  }

  /**
   * Dynamically load Vapi SDK script
   */
  private async loadVapiSDK(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      if (this.isVapiLoaded && this.vapi) {
        resolve();
        return;
      }

      // Check if Vapi is already loaded globally
      if ((window as any).Vapi) {
        this.vapi = (window as any).Vapi;
        this.isVapiLoaded = true;
        resolve();
        return;
      }

      // Load Vapi SDK script dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vapi-ai/web@latest/dist/index.js';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        if ((window as any).Vapi) {
          this.vapi = (window as any).Vapi;
          this.isVapiLoaded = true;
          resolve();
        } else {
          reject(new Error('Vapi SDK loaded but not available globally'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Vapi SDK'));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  /**
   * Initialize Vapi with credentials
   */
  private async initVapi(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Vapi credentials not available');
    }

    await this.loadVapiSDK();

    if (!this.vapi) {
      throw new Error('Vapi SDK not loaded');
    }

    // Initialize if not already done
    if (!this.vapi._instance) {
      this.vapi._instance = new this.vapi({
        publicKey: this.vapiPublicKey,
        assistantId: this.vapiAssistantId,
      });
    }
  }

  renderChatInterface(config: any, onClose: () => void): React.ReactNode {
    if (!this.isAvailable()) {
      return this.renderUnavailableMessage();
    }
    
    // Return Vapi-powered interface (placeholder for now)

    return <TestChatbot 
      isOpen={true}
      onClose={onClose}
      config={config}
      mode="fixed"
      processingMode="vapi"
    />;
  }

  async handleSendMessage(message: string, config: any): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Vapi-Modus nicht verfügbar - API-Schlüssel fehlen');
    }

    try {
      await this.initVapi();
      
      if (!this.vapi._instance) {
        throw new Error('Vapi instance not initialized');
      }

      // Send message to Vapi assistant
      const response = await new Promise((resolve, reject) => {
        // Set up event listeners for response
        const messageHandler = (event: any) => {
          if (event.type === 'message' && event.message?.content) {
            this.vapi._instance.off('message', messageHandler);
            resolve(event.message.content);
          }
        };

        const errorHandler = (event: any) => {
          this.vapi._instance.off('error', errorHandler);
          this.vapi._instance.off('message', messageHandler);
          reject(new Error(`Vapi error: ${event.error || 'Unknown error'}`));
        };

        // Listen for events
        this.vapi._instance.on('message', messageHandler);
        this.vapi._instance.on('error', errorHandler);

        // Send the message
        this.vapi._instance.send({
          type: 'add-message',
          message: {
            role: 'user',
            content: message,
          },
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          this.vapi._instance.off('message', messageHandler);
          this.vapi._instance.off('error', errorHandler);
          reject(new Error('Vapi response timeout'));
        }, 10000);
      });

      return response as string;
    } catch (error) {
      const botName = config.activeBot === 'chatbot' ? config.chatbot.name : config.voicebot.name;
      console.warn('Vapi API Error:', error);
      return `[VAPI-FEHLER] ${botName}: ${error instanceof Error ? error.message : 'Vapi-Service nicht erreichbar'}. Versuchen Sie es später erneut.`;
    }
  }

  renderVoiceInterface(config: any, onClose: () => void): React.ReactNode {
    if (!this.isAvailable()) {
      return this.renderUnavailableMessage();
    }

    // TODO: Implement Vapi Voice Widget

    return <TestChatbot 
      isOpen={true}
      onClose={onClose}
      config={config}
      mode="fixed"
      processingMode="vapi"
    />;
  }

  async handleVoiceInput(config: any): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Vapi-Modus nicht verfügbar - API-Schlüssel fehlen');
    }

    try {
      await this.initVapi();
      
      if (!this.vapi._instance) {
        throw new Error('Vapi instance not initialized');
      }

      // Start voice input session with Vapi
      await new Promise((resolve, reject) => {
        const voiceStartHandler = (event: any) => {
          if (event.type === 'speech-start') {
            this.vapi._instance.off('speech-start', voiceStartHandler);
            resolve(void 0);
          }
        };

        const errorHandler = (event: any) => {
          this.vapi._instance.off('error', errorHandler);
          this.vapi._instance.off('speech-start', voiceStartHandler);
          reject(new Error(`Vapi voice input error: ${event.error || 'Unknown voice error'}`));
        };

        // Listen for voice session start
        this.vapi._instance.on('speech-start', voiceStartHandler);
        this.vapi._instance.on('error', errorHandler);

        // Start voice input session
        this.vapi._instance.start();

        // Timeout after 15 seconds
        setTimeout(() => {
          this.vapi._instance.off('speech-start', voiceStartHandler);
          this.vapi._instance.off('error', errorHandler);
          reject(new Error('Vapi voice input timeout'));
        }, 15000);
      });
    } catch (error) {
      console.warn('Vapi Voice Input Error:', error);
      throw error; // Re-throw to allow fallback handling
    }
  }

  async handleTextToSpeech(text: string, config: any): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Vapi-Modus nicht verfügbar - API-Schlüssel fehlen');
    }

    try {
      await this.initVapi();
      
      if (!this.vapi._instance) {
        throw new Error('Vapi instance not initialized');
      }

      // Use Vapi's built-in TTS capabilities
      await new Promise((resolve, reject) => {
        const speechHandler = (event: any) => {
          if (event.type === 'speech-end') {
            this.vapi._instance.off('speech-end', speechHandler);
            resolve(void 0);
          }
        };

        const errorHandler = (event: any) => {
          this.vapi._instance.off('error', errorHandler);
          this.vapi._instance.off('speech-end', speechHandler);
          reject(new Error(`Vapi TTS error: ${event.error || 'Unknown TTS error'}`));
        };

        // Listen for speech completion
        this.vapi._instance.on('speech-end', speechHandler);
        this.vapi._instance.on('error', errorHandler);

        // Trigger TTS
        this.vapi._instance.say(text);

        // Timeout after 30 seconds
        setTimeout(() => {
          this.vapi._instance.off('speech-end', speechHandler);
          this.vapi._instance.off('error', errorHandler);
          reject(new Error('Vapi TTS timeout'));
        }, 30000);
      });
    } catch (error) {
      console.warn('Vapi TTS Error:', error);
      throw error; // Re-throw to allow fallback to Web Speech API
    }
  }

  getBubbleButton(config: any, onClick: () => void, isVisible: boolean): React.ReactNode {

    return <TestChatBubbleButton 
      config={config}
      onClick={onClick}
      isVisible={isVisible}
      data-testid="bubble-vapi-mode"
    />;
  }

  isAvailable(): boolean {
    return !!(this.vapiPublicKey && this.vapiAssistantId);
  }

  getDisplayName(): string {
    return 'Vapi-Widget (Professionell)';
  }

  getDescription(): string {
    return 'Echte Voice-AI für professionelle Tests';
  }

  private renderUnavailableMessage(): React.ReactNode {
    const UnavailableMessage = () => (
      <div className="p-6 text-center bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
        <div className="mb-3">
          <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-amber-600">⚠️</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Vapi-Modus nicht verfügbar</h3>
        <div className="space-y-3 text-sm text-amber-700">
          <p>Die erforderlichen API-Schlüssel sind nicht konfiguriert:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="bg-amber-100 px-1 rounded">VITE_VAPI_PUBLIC_KEY</code></li>
            <li><code className="bg-amber-100 px-1 rounded">VITE_VAPI_ASSISTANT_ID</code></li>
          </ul>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-700">
            💡 <strong>Tipp:</strong> Wechseln Sie zum <strong>Lokal-Modus</strong> für sofortige Tests mit Browser-APIs.
          </p>
        </div>
      </div>
    );
    
    return <UnavailableMessage />;
  }
}

/**
 * Mode Adapter Factory
 */
export function createModeAdapter(mode: ConfigMode): IModeAdapter {
  switch (mode) {
    case 'local':
      return new LocalModeAdapter();
    case 'vapi':
      return new VapiWidgetModeAdapter();
    default:
      throw new Error(`Unbekannter Modus: ${mode}`);
  }
}

/**
 * Hook to get current mode adapter
 */
export function useModeAdapter(mode: ConfigMode): IModeAdapter {
  return createModeAdapter(mode);
}