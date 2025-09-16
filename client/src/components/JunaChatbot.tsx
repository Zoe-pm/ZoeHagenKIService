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

interface JunaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Banner/toast system for error messages with Calendly fallback
function showBanner(msg: string) {
  // Create enhanced error popup with Calendly booking option
  const banner = document.createElement('div');
  banner.className = 'fixed top-4 right-4 bg-black/90 text-white px-4 py-3 rounded-lg shadow-lg z-[99999] max-w-sm';
  banner.style.animation = 'slideInRight 0.3s ease-out';
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'space-y-3';
  
  // Original error message
  const errorText = document.createElement('div');
  errorText.textContent = msg;
  content.appendChild(errorText);
  
  // Additional sentence for Calendly option
  const calendlyText = document.createElement('div');
  calendlyText.textContent = 'Hier können Sie alternativ einen Termin buchen:';
  calendlyText.className = 'text-sm opacity-90';
  content.appendChild(calendlyText);
  
  // Calendly button
  const calendlyButton = document.createElement('button');
  calendlyButton.textContent = '📅 Termin vereinbaren';
  calendlyButton.className = 'w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors cursor-pointer border border-white/20 hover:border-white/40';
  calendlyButton.onclick = () => {
    // Open Calendly in new tab using the same URL as the widget
    window.open('https://calendly.com/zoeskistudio?embed_domain=' + window.location.hostname, '_blank');
  };
  content.appendChild(calendlyButton);
  
  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.className = 'absolute top-1 right-2 text-white/70 hover:text-white text-lg font-bold cursor-pointer';
  closeButton.onclick = () => {
    banner.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 300);
  };
  
  banner.appendChild(content);
  banner.appendChild(closeButton);
  document.body.appendChild(banner);
  
  // Auto remove after 10 seconds (increased due to additional content)
  setTimeout(() => {
    if (banner.parentNode) {
      banner.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 300);
    }
  }, 10000);
}

// Juna chat function - secure server proxy call
async function askJuna(payload: any) {
  try {
    // Call the secure server proxy endpoint
    const res = await fetch('/api/juna/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      throw new Error(`Server proxy error ${res.status}`);
    }
    
    const data = await res.json();
    
    // Check if server returned an error
    if (data.error) {
      throw new Error(data.message || 'Server error');
    }
    
    // Return the response from the server proxy
    return { response: data.response };
  } catch (e) {
    console.error('[JUNA_ERROR]', e);
    showBanner('🛠️ Ich werde kurz gewartet – bin gleich wieder da.');
    return { error: true };
  }
}

export function JunaChatbot({ isOpen, onClose }: JunaChatbotProps) {

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session ID for Juna
  const getSessionId = () => {
    let sessionId = localStorage.getItem('junaSessionId');
    if (!sessionId) {
      sessionId = `juna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('junaSessionId', sessionId);
    }
    return sessionId;
  };

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
      // Prepare payload for server proxy
      const payload = {
        message: messageToSend,
        sessionId: getSessionId()
      };

      const result = await askJuna(payload);
      
      if (result.error) {
        // Error already handled by askJuna function with showBanner
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte versuchen Sie es in einem Moment erneut.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Process successful response
      const botResponse = result.response || 'Entschuldigung, ich konnte keine Antwort generieren.';
      
      // Check if bot suggests appointment booking (based on response content or user input)
      const shouldShowCalendly = botResponse.toLowerCase().includes('termin') || 
        botResponse.toLowerCase().includes('beratung') || 
        botResponse.toLowerCase().includes('gespräch') ||
        botResponse.toLowerCase().includes('demo') ||
        botResponse.toLowerCase().includes('calendly') ||
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

    } catch (error) {
      console.error('[JUNA_ERROR] Unexpected error:', error);
      showBanner('💭 Es ist ein unerwarteter Fehler aufgetreten.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, es ist ein technischer Fehler aufgetreten. Bitte kontaktieren Sie uns direkt: +49 01719862773',
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
      <div 
        id="juna-chat"
        className="fixed bottom-20 right-4 w-80 sm:w-80 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] h-[32rem] max-h-[calc(100vh-10rem)] glass rounded-lg shadow-xl border border-primary/20 overflow-hidden flex flex-col"
        style={{
          maxWidth: 'min(320px, calc(100vw - 2rem))',
          zIndex: 2147483650  // Above everything including voice widget
        }}
        data-testid="container-juna-chat"
      >
        {/* Header */}
        <div className="button-gradient p-4 text-white flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="font-semibold">Juna - 24/7 für Sie da.</h3>
            <p className="text-sm opacity-90">Zoë's KI Service</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
            data-testid="button-close-juna-chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 relative z-0" data-testid="juna-chat-messages">
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
                    data-testid="button-open-calendly"
                  />
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'button-gradient text-white ml-4'
                      : 'bg-muted mr-4'
                  }`}
                  data-testid={`message-${message.sender}-${message.id}`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted mr-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Juna tippt...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-primary/20 p-4 flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ihre Nachricht..."
              disabled={isLoading}
              className="flex-1"
              data-testid="input-juna-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              size="sm"
              data-testid="button-send-juna-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Chat bubble button component
export function JunaChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20 pointer-events-auto"
      size="sm"
      data-testid="button-open-juna-chat"
    >
      <MessageCircle className="h-8 w-8 text-white drop-shadow-lg" />
    </Button>
  );
}