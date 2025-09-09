
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

declare global {
  interface Window {
    openChatbot?: () => void;
  }
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const open = () => {
      console.log('Opening chatbot via global function');
      setIsOpen(true);
    };

    (window as any).openChatbot = open;

    return () => {
      // sauber entfernen
      delete (window as any).openChatbot;
    };
  }, []);

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
      let botResponse = '';

      // 1) Versuch: echter n8n-Webhook
      try {
        const response = await fetch('https://zoebahati.app.n8n.cloud/webhook/fd03b457-76f0-409a-ae7d-e9974b6e807c/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageToSend,
            timestamp: new Date().toISOString(),
            source: 'website-chatbot'
          })
        });

        if (response.ok) {
          const ct = response.headers.get('content-type') ?? '';
          let data: any = null;
          if (ct.includes('application/json')) {
            data = await response.json();
          } else {
            const text = await response.text();
            try {
              data = JSON.parse(text);
            } catch {
              data = text;
            }
          }

          if (data && typeof data === 'object' && 'response' in data) {
            botResponse = data.response;
          } else if (data && typeof data === 'object' && 'message' in data) {
            botResponse = data.message;
          } else if (typeof data === 'string') {
            botResponse = data;
          }
        }
      } catch (webhookError) {
        console.log('Webhook nicht erreichbar, nutze Fallback-Antworten');
      }

      // 2) Fallback: einfache Regelantworten
      if (!botResponse) {
        botResponse = 'Vielen Dank für Ihre Nachricht! ';
        const input = messageToSend.toLowerCase();

        if (input.includes('preis') || input.includes('kosten') || input.includes('tarif')) {
          botResponse += 'Gerne besprechen wir mit Ihnen individuelle Preise. Kontaktieren Sie uns unter +49 171 9862773 für ein persönliches Angebot.';
        } else if (input.includes('termin') || input.includes('beratung') || input.includes('gespräch')) {
          botResponse += 'Lassen Sie uns einen Beratungstermin vereinbaren! Rufen Sie an: +49 171 9862773 oder schreiben Sie an zoe-kiconsulting@pm.me';
        } else if (input.includes('chatbot') || input.includes('voicebot') || input.includes('avatar') || input.includes('wissensbot')) {
          botResponse += 'Unsere KI-Assistenten unterstützen in Support, Vertrieb und Onboarding. Welcher Bereich interessiert Sie am meisten?';
        } else if (input.includes('hallo') || input.includes('hi') || input.includes('guten tag')) {
          botResponse += 'Schön, dass Sie da sind! Wie kann ich Ihnen heute helfen?';
        } else if (input.includes('funktionen') || input.includes('features') || input.includes('können')) {
          botResponse += 'Unsere Lösungen bieten 24/7 Support, automatische Antworten, Wissensdatenbanken u.v.m. Was interessiert Sie besonders?';
        } else {
          botResponse += 'Ich leite Ihre Anfrage gerne an unser Team weiter. Für schnelle Hilfe: +49 171 9862773';
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
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt: +49 171 9862773',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full button-gradient shadow-lg hover:scale-110 transition-transform"
        aria-label={isOpen ? 'Chat schließen' : 'Chat öffnen'}
        data-testid="chatbot-toggle"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 w-80 max-h-[calc(100vh-8rem)] h-96 glass rounded-lg shadow-xl border border-primary/20 overflow-hidden"
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="button-gradient p-4 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Hallo!</h3>
            </div>
            <p className="text-sm opacity-90">24/7 an Ihrer Seite</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3" data-testid="chat-messages">
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
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
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
      )}
    </>
  );
}