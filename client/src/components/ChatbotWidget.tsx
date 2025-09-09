import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

// Global function to open the chatbot
declare global {
  interface Window {
    openChatbot: () => void;
  }
}

export default function ChatbotWidget() {
  useEffect(() => {
    // Clear any existing chat instance
    const existingChat = document.getElementById('n8n-chat');
    if (existingChat) {
      existingChat.innerHTML = '';
    }

    const chat = createChat({
      webhookUrl: 'https://zoebahati.app.n8n.cloud/webhook/fd03b457-76f0-409a-ae7d-e9974b6e807c/chat',
      webhookConfig: {
        method: 'POST',
        headers: {}
      },
      target: '#n8n-chat',
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: true,
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: 'de',
      initialMessages: [
        'Hier um zu helfen',
        'Ich bin Chatty, Ihre digitale Unterstützung. Womit kann ich helfen?'
      ],
      i18n: {
        en: {
          title: 'Ich bin Chatty',
          subtitle: '24/7 für Sie da',
          footer: '',
          getStarted: 'Los geht´s',
          inputPlaceholder: 'Fragen Sie mich was...'
        }
      },
      enableStreaming: false,
    });

    // Create global function to open chatbot
    window.openChatbot = () => {
      const chatElement = document.querySelector('[data-testid="n8n-chat"]') as HTMLElement;
      if (chatElement) {
        chatElement.click();
      } else {
        // Fallback: trigger chat to show
        const chatContainer = document.getElementById('n8n-chat');
        if (chatContainer) {
          const chatButton = chatContainer.querySelector('button');
          if (chatButton) {
            chatButton.click();
          }
        }
      }
    };
    
    return () => {
      // Cleanup
      if (window.openChatbot) {
        delete window.openChatbot;
      }
    };
  }, []);

  return <div id="n8n-chat"></div>;
}