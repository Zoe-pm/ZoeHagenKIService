import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendlyWidget, CalendlyButton } from './CalendlyWidget';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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

// Configure marked for better rendering
marked.setOptions({
  gfm: true,
  breaks: true
});


// Banner/toast system for error messages with Calendly fallback
function showBanner(msg: string, onCalendlyClick?: () => void) {
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
    // Use CalendlyWidget if callback provided, otherwise open in new tab
    if (onCalendlyClick) {
      onCalendlyClick();
    } else {
      window.open('https://calendly.com/zoeskistudio?embed_domain=' + window.location.hostname, '_blank');
    }
    // Remove banner after clicking
    banner.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 300);
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

// Safe Markdown rendering function
function renderMarkdownSafe(text: string): string {
  if (!text) return '';
  
  // Normalize line endings and render markdown
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const html = marked.parse(normalizedText) as string;
  
  // Sanitize with DOMPurify and configure links to open in new tab
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
  
  // Ensure all links open in new tab with security attributes
  return sanitized.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}

// Juna chat function - secure server proxy call
async function askJuna(payload: any) {
  try {
    // Static deployment check - show Calendly directly if in static mode
    if (import.meta.env.VITE_STATIC === 'true') {
      showBanner('🎯 Gerne verbinden wir Sie direkt mit unserem Terminbuchungssystem.', () => {
        window.open('https://calendly.com/zoeskistudio?embed_domain=' + window.location.hostname, '_blank');
      });
      return { error: true };
    }
    
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
    showBanner('🛠️ Ich werde kurz gewartet – bin gleich wieder da.', () => {
      // Open Calendly in new tab as fallback
      window.open('https://calendly.com/zoeskistudio?embed_domain=' + window.location.hostname, '_blank');
    });
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
  const [showCalendlyError, setShowCalendlyError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const pendingBotScrollIdRef = useRef<string | null>(null);
  const botMessageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Session ID for Juna
  const getSessionId = () => {
    let sessionId = localStorage.getItem('junaSessionId');
    if (!sessionId) {
      sessionId = `juna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('junaSessionId', sessionId);
    }
    return sessionId;
  };

  // Check if mobile viewport using matchMedia
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Listen for changes with fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);

  // Reset chat function
  const resetChat = () => {
    setMessages(getInitialMessages());
    setInputText('');
    setIsLoading(false);
    setShowCalendly(false);
    // Clean up refs
    botMessageRefs.current.clear();
    isAtBottomRef.current = true;
    pendingBotScrollIdRef.current = null;
  };

  const handleClose = () => {
    resetChat();
    onClose();
  };

  const handleCalendlyClose = () => {
    setShowCalendly(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is at bottom of messages
  const checkIsAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const threshold = 10; // pixels from bottom
    const { scrollHeight, scrollTop, clientHeight } = container;
    return scrollHeight - (scrollTop + clientHeight) <= threshold;
  };

  // Scroll to beginning of a specific bot message
  const scrollToBotMessage = (messageId: string) => {
    const messageElement = botMessageRefs.current.get(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" // Show beginning of the message
      });
    }
  };

  // Track user scroll activity with bottom proximity
  const handleScroll = () => {
    requestAnimationFrame(() => {
      isAtBottomRef.current = checkIsAtBottom();
    });
  };

  // Reset chat when component opens
  useEffect(() => {
    if (isOpen) {
      resetChat();
    }
  }, [isOpen]);

  // Smart scroll logic for new messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Check if there's a pending bot message to scroll to
    if (pendingBotScrollIdRef.current && isAtBottomRef.current) {
      setTimeout(() => {
        scrollToBotMessage(pendingBotScrollIdRef.current!);
        pendingBotScrollIdRef.current = null;
      }, 100);
      return;
    }
    
    const lastMessage = messages[messages.length - 1];
    
    // For user messages, scroll to bottom if user was at bottom
    if (lastMessage.sender === 'user' && isAtBottomRef.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
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
        pendingBotScrollIdRef.current = errorMessage.id;
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
      
      // Set pending scroll to new bot message
      pendingBotScrollIdRef.current = botMessage.id;
      
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
      pendingBotScrollIdRef.current = errorMessage.id;
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
        className={`fixed bottom-20 right-4 w-80 sm:w-80 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] h-[32rem] max-h-[calc(100vh-10rem)] glass rounded-lg shadow-xl border border-primary/20 overflow-hidden flex flex-col transition-opacity duration-300 ${
          showCalendly && isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          maxWidth: 'min(320px, calc(100vw - 2rem))',
          zIndex: showCalendly ? 2147483649 : 2147483650  // Lower z-index when Calendly is open
        }}
        aria-hidden={showCalendly}
        {...(showCalendly && { inert: '' })}  // TypeScript-friendly conditional inert
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
        <div 
          ref={messagesContainerRef}
          className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 relative z-0" 
          data-testid="juna-chat-messages"
          onScroll={handleScroll}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'calendly_button' ? (
                <div className="max-w-[80%] rounded-lg p-3 bg-muted mr-4 space-y-3">
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <CalendlyButton 
                    onClick={() => setShowCalendly(true)}
                    text="Termin vereinbaren"
                    variant="outline"
                    data-testid="button-open-calendly"
                  />
                </div>
              ) : (
                <div
                  ref={(el) => {
                    if (message.sender === 'bot') {
                      if (el) {
                        botMessageRefs.current.set(message.id, el);
                      } else {
                        botMessageRefs.current.delete(message.id);
                      }
                    }
                  }}
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'button-gradient text-white ml-4'
                      : 'bg-muted mr-4'
                  }`}
                  data-testid={`message-${message.sender}-${message.id}`}
                >
                  {message.sender === 'bot' ? (
                    <div 
                      className="text-sm text-foreground [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2 [&>li]:mb-1 [&>p]:text-current [&>ul]:text-current [&>ol]:text-current [&>li]:text-current"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(message.text) }}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  )}
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