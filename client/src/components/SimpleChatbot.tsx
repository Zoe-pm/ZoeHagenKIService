import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createChat } from '@n8n/chat';

export function SimpleChatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      // Clear any existing chat
      const chatContainer = document.getElementById('n8n-chat-modal');
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
      
      // Create the n8n chat
      createChat({
        webhookUrl: 'https://zoebahati.app.n8n.cloud/webhook/fd03b457-76f0-409a-ae7d-e9974b6e807c/chat',
        target: '#n8n-chat-modal',
        mode: 'window',
        defaultLanguage: 'en',
        initialMessages: [
          'Hallo! Ich bin Ihre digitale Unterstützung. Womit kann ich helfen?'
        ],
        i18n: {
          en: {
            title: 'Hallo!',
            subtitle: '24/7 an Ihrer Seite',
            footer: '',
            getStarted: 'Los geht´s',
            inputPlaceholder: 'Fragen Sie mich was...',
            closeButtonTooltip: 'Chat schließen'
          }
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 h-96 glass rounded-lg shadow-xl border border-primary/20 overflow-hidden">
      <div id="n8n-chat-modal" className="w-full h-full"></div>
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