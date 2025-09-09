import { useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
// @ts-ignore
import { createChat } from '@n8n/chat';

interface SimpleChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleChatbot({ isOpen, onClose }: SimpleChatbotProps) {
  const chatInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && !chatInitialized.current) {
      const chatContainer = document.getElementById('n8n-chat-container');
      if (chatContainer) {
        chatContainer.innerHTML = '';
        
        console.log('Initializing n8n chat with same config as ZoesChatbot...');
        
        // @ts-ignore - Using exact same config as ZoesChatbot
        createChat({
          webhookUrl: 'https://zoebahati.app.n8n.cloud/webhook/fd03b457-76f0-409a-ae7d-e9974b6e807c/chat',
          target: '#n8n-chat-container',
          mode: 'window',
          defaultLanguage: 'de',
          initialMessages: [
            'Hallo! Ich bin Ihre digitale Unterstützung. Womit kann ich helfen?'
          ],
          i18n: {
            de: {
              title: "Hallo!",
              subtitle: "24/7 an Ihrer Seite",
              footer: 'Schön dass Sie da sind!',
              getStarted: 'Frag mich was!',
              inputPlaceholder: 'Fragen Sie mich was...',
            }
          }
        });
        
        chatInitialized.current = true;
      }
    } else if (!isOpen) {
      chatInitialized.current = false;
    }
  }, [isOpen]);

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

      {/* N8n Chat Container */}
      <div id="n8n-chat-container" className="flex-1 h-80 overflow-hidden">
        {/* N8n chat will be injected here */}
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