# Zoë's KI Service - German AI Consulting Website

Mobile-optimized German AI consulting website with working Calendly booking integration, Juna chatbot, and n8n webhook support for production deployment at **https://zoehagenkiconsulting.de**

## 🚀 Features

- ✅ **Responsive Design** - Mobile-first, optimiert für alle Bildschirmgrößen
- ✅ **Chat & Voice Bots** - Juna Chatbot und Voice Assistant (rechts unten positioniert)
- ✅ **n8n Webhook Integration** - Production-ready webhook für AI Chat
- ✅ **Calendly Integration** - Direkte Terminbuchung
- ✅ **Static Deployment** - Optimiert für kostengünstige Static Hosting
- ✅ **Security Headers** - CSP & CORS korrekt konfiguriert

## 🏗️ Architektur

### Frontend
- React 18 mit TypeScript
- Vite Build System
- TailwindCSS + Shadcn UI
- Wouter Routing
- Lucide Icons

### Backend (Development)
- Express.js Server
- Drizzle ORM + PostgreSQL
- Session Management
- n8n Proxy Endpoint

### Bot System
- **Juna Chatbot** - n8n webhook integration
- **Voice Assistant** - Vapi.ai integration
- **Bottom-right positioning** - Fixed, responsive layout

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
VITE_STATIC=true NODE_ENV=production npm run build
```

## 🔧 Configuration

### n8n Webhook
Konfiguriert in `client/index.html`:
```javascript
window.n8nChatConfig = {
  webhookUrl: 'https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat',
  botName: 'Juna',
  greeting: 'Hallo! Ich bin Juna, Ihre KI-Assistentin. Wie kann ich Ihnen helfen?'
};
```

### CSP Headers
Server-side CSP headers in `server/index.ts`:
- Erlaubt: `zoebahati.app.n8n.cloud` für Webhook
- Erlaubt: `calendly.com` für Booking Widget
- Erlaubt: Google Fonts, CDN Fonts

## 🚢 Deployment

### GitHub Actions
Automatischer Workflow bei Push auf `main`/`master`:
1. Dependencies installieren
2. Production Build erstellen
3. Build Artifacts hochladen

### Manuelles Deployment
```bash
# 1. Production Build
VITE_STATIC=true NODE_ENV=production npm run build

# 2. Upload dist/public/ zu Hosting (Strato, Render, etc.)
```

### Production Files
- `dist/public/index.html` - Main HTML (enthält n8n config)
- `dist/public/assets/` - JS/CSS Bundles
- `dist/public/images/` - Bilder
- `dist/public/videos/` - Videos

## 🎨 Design System

### Farben
- Primary: `#9b87f5` (Lila)
- Secondary: Komplementäre Farben
- Dark Mode: Standard

### Fonts
- **Logo**: Alan Sans (CDN)
- **Body**: Inter Tight (Google Fonts)

### Bot Position
- **Fixed Position**: Bottom-right corner
- **Layout**: Horizontal (side-by-side)
- **Z-Index**: 2147483647 (höchste Priorität)
- **Responsive**: Funktioniert auf allen Geräten

## 🧪 Testing

```bash
# Development testen
npm run dev

# Production Build testen
npm run build
# Dann dist/public/index.html öffnen
```

## 📝 Important Notes

### Critical Fixes Applied
1. ✅ **Bot Positioning** - Removed `pointer-events: none` from dock container
2. ✅ **n8n Script** - Changed to regular `<script>` (not `type="module"`) to survive build
3. ✅ **CSP Headers** - Added server-side headers for n8n webhook
4. ✅ **CORS** - Configured for n8n communication

### Known Issues
- Vite plugin system cannot be modified (vite.config.ts is forbidden)
- n8n config must be in `<script>` (not `<script type="module">`)

## 🔗 Links

- **Production**: https://zoehagenkiconsulting.de
- **n8n Webhook**: https://zoebahati.app.n8n.cloud
- **Calendly**: https://calendly.com/zoeskistudio

## 📄 License

Proprietary - Zoë Hagen KI Consulting
