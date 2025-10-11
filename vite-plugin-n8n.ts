// Vite plugin to inject n8n configuration into production builds
import type { Plugin } from 'vite';

export default function n8nConfigPlugin(): Plugin {
  return {
    name: 'vite-plugin-n8n-config',
    transformIndexHtml(html) {
      // Only inject in production builds
      if (process.env.NODE_ENV === 'production' || process.env.VITE_STATIC === 'true') {
        const n8nScript = `
    <!-- n8n Chat Widget Integration -->
    <script>
      // n8n Webhook Chat Widget for Production
      window.n8nChatConfig = {
        webhookUrl: 'https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat',
        botName: 'Juna',
        greeting: 'Hallo! Ich bin Juna, Ihre KI-Assistentin. Wie kann ich Ihnen helfen?'
      };
    </script>`;
        
        // Inject before closing body tag
        return html.replace('</body>', `${n8nScript}\n  </body>`);
      }
      return html;
    }
  };
}
