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
    widgetSize: string;
    fontFamily: string;
    position: string;
    greeting: string;
    title: string;
    subtitle: string;
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
  };
}

interface TestChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  authToken?: string;
  config: TestConfig;
}

export function TestChatbot({ isOpen, onClose, authToken, config }: TestChatbotProps) {
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
    const subtitle = config.activeBot === "chatbot" ? config.chatbot.subtitle : config.voicebot.subtitle;
    const greetingText = subtitle ? `${subtitle}\n\n${currentConfig.greeting}` : currentConfig.greeting;
    
    const initialMessage: Message = {
      id: '1',
      text: greetingText,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    
    // Speak initial greeting if voicebot
    if (config.activeBot === "voicebot" && voiceEnabled) {
      speakText(currentConfig.greeting);
    }
  }, [currentConfig.greeting, config.activeBot, voiceEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if (!speechSynthesis || config.activeBot !== "voicebot") return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.voicebot.voiceSpeed[0] || 1;
    utterance.pitch = config.voicebot.voicePitch[0] || 1;
    utterance.lang = 'de-DE';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
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
      // TEST-Bot responses (not your real bot)
      const testResponses: { [key: string]: string } = {
        "hallo": `Hallo! Ich bin ${currentConfig.name}, Ihr TEST-Assistent. Das ist nur eine Vorschau der Funktionalität.`,
        "test": "Das ist ein Test-Bot zur Demonstration. Ihr echter Bot wird individuell konfiguriert und trainiert.",
        "funktionen": "In der echten Version kann ich Ihre spezifischen Fragen beantworten, Termine buchen und vieles mehr.",
        "kosten": "Für genaue Preise und Funktionen sprechen Sie bitte mit Zoë. Dies ist nur eine Demo.",
        "voice": config.activeBot === "voicebot" ? "Ich kann sprechen! Probieren Sie die Sprachausgabe aus." : "Wechseln Sie zum Voicebot um die Sprachfunktion zu testen.",
        "default": `Ich bin ${currentConfig.name}, Ihr digitaler Test-Assistent. In der echten Version werde ich mit Ihren spezifischen Inhalten und Workflows trainiert.`
      };

      const messageLower = messageToSend.toLowerCase();
      let botResponse = testResponses.default;
      
      for (const [key, value] of Object.entries(testResponses)) {
        if (messageLower.includes(key)) {
          botResponse = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak response if voicebot and voice enabled
      if (config.activeBot === "voicebot" && voiceEnabled) {
        speakText(botResponse);
      }

    } catch (error) {
      console.error('Test chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, es gab einen Fehler. Das ist ein Test-System - Ihr echter Bot wird zuverlässiger funktionieren.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const widgetSizeClasses = {
    small: 'w-80 h-80',
    medium: 'w-96 h-[450px]', // Reduzierte Höhe für bessere mobile Darstellung
    large: 'w-[450px] h-[520px]' // Reduzierte Höhe für bessere mobile Darstellung
  };

  const sizeClass = widgetSizeClasses[currentConfig.widgetSize as keyof typeof widgetSizeClasses] || widgetSizeClasses.medium;

  return (
    <div 
      className={`fixed ${sizeClass} shadow-2xl border rounded-lg z-50 flex flex-col max-h-[80vh]`}
      style={{
        backgroundColor: currentConfig.backgroundColor,
        bottom: '80px',
        maxHeight: 'calc(100vh - 120px)',
        fontFamily: config.activeBot === "chatbot" ? config.chatbot.fontFamily : 'Inter',
        // Position respektieren
        ...(currentConfig.position === 'bottom-left' && { left: '20px' }),
        ...(currentConfig.position === 'bottom-right' && { right: '20px' }),
        ...(currentConfig.position === 'center' && { left: '50%', transform: 'translateX(-50%)' })
      }}
      data-testid="test-chatbot-widget"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b text-white rounded-t-lg"
        style={{ backgroundColor: currentConfig.primaryColor }}
      >
        <div className="flex items-center gap-2">
          {config.activeBot === "chatbot" ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
          <div>
            <div className="font-semibold">{currentConfig.name} (TEST)</div>
            <div className="text-xs text-white/80">{config.activeBot === "chatbot" ? config.chatbot.title : config.voicebot.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {config.activeBot === "voicebot" && (
            <Button
              onClick={toggleVoice}
              size="sm"
              variant="ghost"
              className="text-white hover:text-white/80 p-1"
              data-testid="button-toggle-voice"
            >
              {voiceEnabled ? (
                isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="text-white hover:text-white/80 p-1"
            data-testid="button-close-test-chat"
          >
            <X className="w-4 h-4" />
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
                  ? 'text-white'
                  : 'bg-muted text-foreground'
              }`}
              style={message.sender === 'user' ? { backgroundColor: currentConfig.primaryColor } : {}}
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