import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatbotWidget() {
  useEffect(() => {
    createChat({
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
        'Ich bin Zoes digitale Unterstützung. Womit kann ich helfen?'
      ],
      i18n: {
        en: {
          title: 'Hallo!',
          subtitle: '24/7 verfügbar',
          footer: '',
          getStarted: 'Los geht´s',
          inputPlaceholder: 'Fragen Sie mich was...'
        }
      },
      enableStreaming: false,
    });
  }, []);

  return <div id="n8n-chat"></div>;
}