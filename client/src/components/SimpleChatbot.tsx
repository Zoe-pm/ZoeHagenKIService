import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendlyWidget, CalendlyButton } from './CalendlyWidget';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'calendly_button';
  timestamp: Date;
}

interface SimpleChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  authToken?: string;
}

export function SimpleChatbot({ isOpen, onClose, authToken }: SimpleChatbotProps) {
  // Initial message
  const getInitialMessages = (): Message[] => [
    {
      id: '1',
      text: "Hey! Ich bin Juna und beantworte gern Fragen rund um Zoë's KI Service.",
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  // Reset chat function
  const resetChat = () => {
    setMessages(getInitialMessages());
    setInputText('');
    setIsLoading(false);
    setShowCalendly(false);
  };

  const handleClose = () => {
    resetChat();
    onClose();
  };

  const handleCalendlyClose = () => {
    setShowCalendly(false);
    resetChat(); // Reset chat after Calendly closes
  };

  // Stable session ID for Juna Chat
  const getSessionId = () => {
    let sessionId = localStorage.getItem('junaSessionId');
    if (!sessionId) {
      sessionId = `juna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('junaSessionId', sessionId);
    }
    return sessionId;
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset chat when component opens
  useEffect(() => {
    if (isOpen) {
      resetChat();
    }
  }, [isOpen]);

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
      
      const response = await fetch('/api/prod-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          botName: "Juna Chat Zoë's KI Service",
          sessionId: getSessionId()
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        botResponse = data.response || 'Entschuldigung, keine Antwort erhalten.';
        
        // Check if bot suggests appointment booking
        const shouldShowCalendly = data.showCalendly || 
          botResponse.toLowerCase().includes('termin') || 
          botResponse.toLowerCase().includes('beratung') || 
          botResponse.toLowerCase().includes('gespräch') ||
          botResponse.toLowerCase().includes('demo') ||
          messageToSend.toLowerCase().includes('termin') ||
          messageToSend.toLowerCase().includes('beratung');
          
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        if (shouldShowCalendly) {
          const calendlyMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: 'Möchten Sie direkt einen Termin vereinbaren?',
            sender: 'calendly_button',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage, calendlyMessage]);
        } else {
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        console.error('JUNA: Server Error:', data);
        botResponse = `[Server Fehler ${response.status}] Juna ist nicht erreichbar.`;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
      
    } catch (error) {
      console.error('JUNA: Chatbot error:', error);
      
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
    <>
      <CalendlyWidget 
        isOpen={showCalendly}
        onClose={handleCalendlyClose}
        calendlyUrl="https://calendly.com/zoeskistudio"
      />
    <div className="fixed bottom-24 right-4 z-40 w-80 sm:w-80 w-[calc(100vw-2rem)] max-w-80 h-[32rem] max-h-[calc(100vh-6rem)] glass rounded-lg shadow-xl border border-primary/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="button-gradient p-4 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <h3 className="font-semibold">Juna- 24/7 für Sie da.</h3>
          <p className="text-sm opacity-90">Zoë's KI Service</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
          data-testid="button-close-chat"
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
            {message.sender === 'calendly_button' ? (
              <div className="max-w-[80%] rounded-lg p-3 bg-muted mr-4 space-y-3">
                <p className="text-sm">{message.text}</p>
                <CalendlyButton 
                  onClick={() => setShowCalendly(true)}
                  text="Termin vereinbaren"
                  variant="outline"
                />
                <span className="text-xs opacity-70 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ) : (
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 mr-4">
              <div className="flex space-x-1">
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
      <div className="p-4 border-t border-primary/20 flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Womit kann ich helfen?"
            disabled={isLoading}
            className="flex-1"
            data-testid="input-chat"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            size="sm"
            className="button-gradient"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

export function ChatbotButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-24 z-[10000] rounded-full w-16 h-16 bg-gradient-to-br from-[#e63973] to-[#E8719A] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20 pointer-events-auto"
      data-testid="button-open-chat"
    >
      <MessageCircle className="h-8 w-8 text-white drop-shadow-lg" />
    </Button>
  );
}