import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface SimpleChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleChatbot({ isOpen, onClose }: SimpleChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hallo! Ich bin Ihre digitale Unterstützung. Womit kann ich helfen?',
      sender: 'bot'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsLoading(true);

    // Try to send to n8n webhook first
    try {
      const response = await fetch('https://zoebahati.app.n8n.cloud/webhook/fd03b457-76f0-409a-ae7d-e9974b6e807c/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          timestamp: new Date().toISOString(),
          source: 'website-chatbot'
        }),
      });

      let botResponse = '';
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.response) {
          botResponse = data.response;
        } else if (data && data.message) {
          botResponse = data.message;
        } else if (data && typeof data === 'string') {
          botResponse = data;
        }
      }
      
      // Fallback to smart responses if webhook fails or returns nothing
      if (!botResponse) {
        botResponse = 'Vielen Dank für Ihre Nachricht! ';
        
        const input = messageToSend.toLowerCase();
        if (input.includes('preis') || input.includes('kosten')) {
          botResponse += 'Gerne besprechen wir individuelle Preise mit Ihnen. Kontaktieren Sie uns: +49 01719862773';
        } else if (input.includes('termin') || input.includes('beratung')) {
          botResponse += 'Lassen Sie uns einen Beratungstermin vereinbaren! Rufen Sie an: +49 01719862773';
        } else if (input.includes('hallo') || input.includes('hi')) {
          botResponse += 'Schön, dass Sie da sind! Wie kann ich Ihnen heute helfen?';
        } else {
          botResponse += 'Für weitere Informationen rufen Sie uns gerne an: +49 01719862773';
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Chat webhook error:', error);
      // Fallback response on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt: +49 01719862773',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 h-96 glass rounded-lg shadow-xl border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="button-gradient p-4 text-white flex justify-between items-center">
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
      <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
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
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Fragen Sie mich was..."
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            size="sm"
            className="button-gradient"
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
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full button-gradient shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat öffnen"
      data-testid="chatbot-toggle"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}