
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SimpleChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  authToken?: string;
}

export function SimpleChatbot({ isOpen, onClose, authToken }: SimpleChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hallo! Ich bin Ihre digitale Unterstützung. Womit kann ich helfen?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      // Production chatbot uses demo responses (stable, no external dependencies)
      const responses: { [key: string]: string } = {
        "hallo": "Hallo! Schön, dass Sie da sind. Wie kann ich Ihnen heute helfen?",
        "service": "Wir bieten AI-Assistenten für Ihr Unternehmen. Chatbots, Voicebots, Avatare und Wissensbots.",
        "kontakt": "Gerne! Buchen Sie ein kostenloses 15-minütiges Erstgespräch über unsere Kontaktseite.",
        "preise": "Unsere Lösungen sind individuell konfiguriert. Lassen Sie uns in einem kurzen Gespräch Ihre Anforderungen besprechen.",
        "termin": "Perfekt! Nutzen Sie einfach unsere Kontaktseite um einen Termin zu buchen.",
        "hilfe": "Ich helfe Ihnen gerne weiter! Fragen Sie mich zu unseren AI-Lösungen oder buchen Sie direkt einen Beratungstermin.",
        "default": "Vielen Dank für Ihre Nachricht. Für detaillierte Informationen zu unseren AI-Lösungen buchen Sie gerne ein kostenloses Erstgespräch!"
      };

      const messageLower = messageToSend.toLowerCase();
      botResponse = responses.default;
      
      for (const [key, value] of Object.entries(responses)) {
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
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt: +49 01719862773',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 sm:w-80 w-[calc(100vw-2rem)] max-w-80 h-[32rem] max-h-[calc(100vh-6rem)] glass rounded-lg shadow-xl border border-primary/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="button-gradient p-4 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <h3 className="font-semibold">Hallo!</h3>
          <p className="text-sm opacity-90">24/7 an Ihrer Seite</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3" data-testid="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
              data-testid={`message-${message.sender}`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Fragen Sie mich was..."
            className="flex-1"
            disabled={isLoading}
            data-testid="chat-input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            size="sm"
            className="button-gradient"
            data-testid="send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ChatbotButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
      aria-label="Chat öffnen"
      data-testid="chatbot-toggle"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
