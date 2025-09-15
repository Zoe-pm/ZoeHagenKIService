import { useState, useRef } from 'react';

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
    const { TestChatbot } = require('./TestChatbot');
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
    const { TestChatbot } = require('./TestChatbot');
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
    const { TestChatBubbleButton } = require('./TestChatBubbleButton');
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

  constructor() {
    // Get Vapi credentials from env
    if (typeof window !== 'undefined') {
      this.vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || null;
      this.vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || null;
    }
  }

  renderChatInterface(config: any, onClose: () => void): React.ReactNode {
    if (!this.isAvailable()) {
      return this.renderUnavailableMessage();
    }
    
    // Return Vapi-powered interface (placeholder for now)
    const { TestChatbot } = require('./TestChatbot');
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

    // TODO: Implement real Vapi API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const botName = config.activeBot === 'chatbot' ? config.chatbot.name : config.voicebot.name;
    return `[VAPI-MODUS] ${botName}: Dies wird bald mit echter Vapi-KI beantwortet. Nachricht erhalten: "${message}"`;
  }

  renderVoiceInterface(config: any, onClose: () => void): React.ReactNode {
    if (!this.isAvailable()) {
      return this.renderUnavailableMessage();
    }

    // TODO: Implement Vapi Voice Widget
    const { TestChatbot } = require('./TestChatbot');
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

    // TODO: Implement Vapi voice input
    throw new Error('Vapi Voice Input wird implementiert');
  }

  async handleTextToSpeech(text: string, config: any): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Vapi-Modus nicht verfügbar - API-Schlüssel fehlen');
    }

    // TODO: Implement Vapi TTS with ElevenLabs
    throw new Error('Vapi TTS wird implementiert');
  }

  getBubbleButton(config: any, onClick: () => void, isVisible: boolean): React.ReactNode {
    const { TestChatBubbleButton } = require('./TestChatBubbleButton');
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
      <div className="p-6 text-center bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Vapi-Modus nicht verfügbar</h3>
        <p className="text-sm text-yellow-700 mb-4">
          Die erforderlichen API-Schlüssel (VITE_VAPI_PUBLIC_KEY, VITE_VAPI_ASSISTANT_ID) sind nicht konfiguriert.
        </p>
        <p className="text-xs text-yellow-600">
          Wechseln Sie zum Lokal-Modus für Tests oder konfigurieren Sie die Vapi-Integration.
        </p>
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