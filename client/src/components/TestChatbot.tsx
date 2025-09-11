import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TestConfig {
  activeBot: "chatbot" | "voicebot";
  chatbot: {
    name: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    widgetSize: string;
    fontFamily: string;
    position: string;
    greeting: string;
    title: string;
    subtitle: string;
    logoUrl: string;
    logoPosition: string;
    logoSize: string;
  };
  voicebot: {
    name: string;
    primaryColor: string;
    backgroundColor: string;
    widgetSize: string;
    position: string;
    voiceSpeed: number[];
    voicePitch: number[];
    elevenLabsVoiceId: string;
    greeting: string;
    title: string;
    subtitle: string;
    logoUrl: string;
    logoPosition: string;
    logoSize: string;
  };
}

interface TestChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  authToken?: string;
  config: TestConfig;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

export function TestChatbot({ isOpen, onClose, authToken, config, n8nWebhookUrl, n8nBotName, n8nBotGreeting }: TestChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;

  const currentConfig = config.activeBot === "chatbot" ? config.chatbot : config.voicebot;

  // Initialize with configured greeting including subtitle
  useEffect(() => {
    // Untertitel sollte nur im Header erscheinen, nicht im Begrüßungstext
    const initialMessage: Message = {
      id: '1',
      text: currentConfig.greeting,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [currentConfig.greeting, config.activeBot]); // Removed voiceEnabled dependency

  // Separate effect for voice greeting when voice is enabled
  useEffect(() => {
    if (config.activeBot === "voicebot" && voiceEnabled && messages.length > 0) {
      speakText(currentConfig.greeting);
    }
  }, [voiceEnabled]); // Only trigger when voice is toggled

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    // Safe guards for TTS functionality
    if (!('speechSynthesis' in window) || 
        typeof window.SpeechSynthesisUtterance === 'undefined' || 
        config.activeBot !== "voicebot") {
      return;
    }
    
    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      // Safe access with fallback values
      utterance.rate = config.voicebot?.voiceSpeed?.[0] ?? 1;
      utterance.pitch = config.voicebot?.voicePitch?.[0] ?? 1;
      utterance.lang = 'de-DE';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        console.warn('TTS Error - Speech synthesis failed');
      };
      
      speechSynthesis.speak(utterance);
    } catch (ttsError) {
      console.warn('TTS not available:', ttsError);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      let botResponse: string;
      
      // Use real n8n chatbot if configured, otherwise fallback to demo responses
      if (n8nWebhookUrl) {
        // Real n8n API Call
        try {
          const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: messageToSend,
              botName: n8nBotName || currentConfig.name
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            botResponse = data.response || data.message || 'Entschuldigung, keine Antwort erhalten.';
          } else {
            botResponse = `[n8n Fehler ${response.status}] Ihr Chatbot ist nicht erreichbar. Bitte prüfen Sie die Webhook-URL.`;
          }
        } catch (n8nError) {
          console.error('n8n API Error:', n8nError);
          botResponse = '[n8n Verbindungsfehler] Ihr Chatbot ist nicht erreichbar. Bitte prüfen Sie die Webhook-URL und Internetverbindung.';
        }
      } else {
        // Fallback: Demo responses when no n8n webhook configured  
        const testResponses: { [key: string]: string } = {
          "hallo": `Hallo! Ich bin ${currentConfig.name}, Ihr TEST-Assistent. Das ist nur eine Vorschau der Funktionalität.`,
          "test": "Das ist ein Test-Bot zur Demonstration. Ihr echter Bot wird individuell konfiguriert und trainiert.",
          "funktionen": "In der echten Version kann ich Ihre spezifischen Fragen beantworten, Termine buchen und vieles mehr.",
          "kosten": "Für genaue Preise und Funktionen sprechen Sie bitte mit Zoë. Dies ist nur eine Demo.",
          "voice": config.activeBot === "voicebot" ? "Ich kann sprechen! Probieren Sie die Sprachausgabe aus." : "Wechseln Sie zum Voicebot um die Sprachfunktion zu testen.",
          "default": `Ich bin ${currentConfig.name}, Ihr digitaler Test-Assistent. In der echten Version werde ich mit Ihren spezifischen Inhalten und Workflows trainiert.`
        };

        const messageLower = messageToSend.toLowerCase();
        botResponse = testResponses.default;
        
        for (const [key, value] of Object.entries(testResponses)) {
          if (messageLower.includes(key)) {
            botResponse = value;
            break;
          }
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot message error:', error instanceof Error ? error.message : 'Unknown error', error);
      // Add user-visible error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Entschuldigung, es gab einen Fehler. Das ist ein Test-System - Ihr echter Bot wird zuverlässiger funktionieren.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      
      // TTS outside main try/catch to prevent crashes
      if (config.activeBot === "voicebot" && voiceEnabled) {
        // Use setTimeout to avoid blocking UI
        setTimeout(() => {
          const lastBotMessage = messages[messages.length - 1];
          if (lastBotMessage?.sender === 'bot') {
            speakText(lastBotMessage.text);
          }
        }, 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const widgetSizeClasses = {
    small: 'h-80',
    medium: 'h-[450px]', // Reduzierte Höhe für bessere mobile Darstellung
    large: 'h-[520px]' // Reduzierte Höhe für bessere mobile Darstellung
  };

  const sizeClass = widgetSizeClasses[currentConfig.widgetSize as keyof typeof widgetSizeClasses] || widgetSizeClasses.medium;
  
  // Responsive width based on screen size
  const getResponsiveWidth = () => {
    if (currentConfig.widgetSize === 'small') return { width: 'clamp(280px, calc(100vw - 40px), 320px)', maxWidth: 'calc(100vw - 40px)' };
    if (currentConfig.widgetSize === 'large') return { width: 'clamp(320px, calc(100vw - 40px), 450px)', maxWidth: 'calc(100vw - 40px)' };
    return { width: 'clamp(300px, calc(100vw - 40px), 384px)', maxWidth: 'calc(100vw - 40px)' }; // medium
  };

  return (
    <div 
      className={`fixed ${sizeClass} shadow-2xl border rounded-lg z-[9999] flex flex-col max-h-[80vh]`}
      style={{
        backgroundColor: currentConfig.backgroundColor,
        bottom: '20px',
        maxHeight: 'calc(100vh - 40px)',
        fontFamily: config.activeBot === "chatbot" ? config.chatbot.fontFamily : 'Inter',
        ...getResponsiveWidth(),
        // Position respektieren
        ...(currentConfig.position === 'bottom-left' && { left: '20px' }),
        ...(currentConfig.position === 'bottom-right' && { right: '20px' }),
        ...(currentConfig.position === 'center' && { left: '50%', transform: 'translateX(-50%)' })
      }}
      data-testid="test-chatbot-widget"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b text-white rounded-t-lg relative min-h-[60px]"
        style={{ backgroundColor: currentConfig.primaryColor }}
      >
        {/* Logo positioned based on config - behind content to prevent overlap */}
        {(config.activeBot === "chatbot" ? config.chatbot.logoUrl : config.voicebot.logoUrl) && (
          <div 
            className={`absolute z-0 ${
              (config.activeBot === "chatbot" ? config.chatbot.logoPosition : config.voicebot.logoPosition) === 'top-left' ? 'left-1 top-1' :
              (config.activeBot === "chatbot" ? config.chatbot.logoPosition : config.voicebot.logoPosition) === 'top-right' ? 'right-1 top-1' : 
              'left-1/2 top-1 transform -translate-x-1/2'
            }`}
            style={{ pointerEvents: 'none', opacity: 0.7 }}
          >
            <img 
              src={config.activeBot === "chatbot" ? config.chatbot.logoUrl : config.voicebot.logoUrl}
              alt="Firmenlogo"
              className={`
                ${(config.activeBot === "chatbot" ? config.chatbot.logoSize : config.voicebot.logoSize) === 'small' ? 'h-6 w-auto' :
                  (config.activeBot === "chatbot" ? config.chatbot.logoSize : config.voicebot.logoSize) === 'large' ? 'h-12 w-auto' : 
                  'h-8 w-auto'}
                rounded
              `}
            />
          </div>
        )}
        
        <div className={`flex items-center gap-2 flex-1 relative z-20 ${
          (config.activeBot === "chatbot" ? config.chatbot.logoUrl : config.voicebot.logoUrl) && 
          (config.activeBot === "chatbot" ? config.chatbot.logoPosition : config.voicebot.logoPosition) === 'top-left' ? 'pl-10' :
          (config.activeBot === "chatbot" ? config.chatbot.logoUrl : config.voicebot.logoUrl) && 
          (config.activeBot === "chatbot" ? config.chatbot.logoPosition : config.voicebot.logoPosition) === 'top-right' ? 'pr-10' :
          (config.activeBot === "chatbot" ? config.chatbot.logoUrl : config.voicebot.logoUrl) && 
          (config.activeBot === "chatbot" ? config.chatbot.logoPosition : config.voicebot.logoPosition) === 'center' ? 'pt-3' : ''
        }`}>
          {config.activeBot === "chatbot" ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
          <div className="flex-1">
            <div className="font-semibold">{currentConfig.name} (TEST)</div>
            {(config.activeBot === "chatbot" ? config.chatbot.subtitle : config.voicebot.subtitle) && (
              <div className="text-xs text-white/80">{config.activeBot === "chatbot" ? config.chatbot.subtitle : config.voicebot.subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {config.activeBot === "voicebot" && (
            <Button
              onClick={toggleVoice}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-3 border border-white/20 rounded-full transition-all hover:scale-110 min-w-[44px] min-h-[44px]"
              data-testid="button-toggle-voice"
              aria-label={voiceEnabled ? "Sprachausgabe deaktivieren" : "Sprachausgabe aktivieren"}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? (
                isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          )}
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 p-3 border border-white/20 rounded-full transition-all hover:scale-110 min-w-[44px] min-h-[44px]"
            data-testid="button-close-test-chat"
            aria-label="Chat schließen"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? ''
                  : 'bg-muted'
              }`}
              style={
                message.sender === 'user' 
                  ? { 
                      backgroundColor: currentConfig.primaryColor,
                      color: config.activeBot === "chatbot" && config.chatbot.textColor ? config.chatbot.textColor : '#FFFFFF'
                    } 
                  : {
                      color: config.activeBot === "chatbot" && config.chatbot.textColor ? config.chatbot.textColor : undefined
                    }
              }
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background/50">
        {config.activeBot === "voicebot" && !voiceEnabled && (
          <div className="text-xs text-muted-foreground mb-2 text-center">
            Aktivieren Sie die Sprachausgabe oben rechts
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Nachricht an ${currentConfig.name}...`}
            disabled={isLoading}
            className="flex-1"
            data-testid="input-test-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            style={{ backgroundColor: currentConfig.primaryColor }}
            className="text-white hover:opacity-80"
            data-testid="button-send-test-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}