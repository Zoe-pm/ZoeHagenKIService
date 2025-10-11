# Deployment Anleitung - Zoë Hagen KI Consulting

## 🚀 Production Deployment zu https://zoehagenkiconsulting.de

### Voraussetzungen
- Node.js 20.x oder höher
- npm
- Git

### Build für Production

```bash
# Production Build erstellen
VITE_STATIC=true NODE_ENV=production npm run build
```

Die fertigen Dateien befinden sich in `dist/public/`

### n8n Webhook Integration

Die Website ist bereits konfiguriert für:
- **Webhook URL**: `https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat`
- **Bot Name**: Juna
- **CSP Headers**: Korrekt konfiguriert für n8n Zugriff

### Features

✅ **Chat & Voice Bots** - Positioniert unten rechts (responsive)
✅ **n8n Webhook** - Funktioniert in Production
✅ **CORS/CSP** - Korrekt konfiguriert
✅ **Static Deployment** - Optimiert für Strato/Render

### GitHub Deployment

Das Repository enthält einen automatischen GitHub Actions Workflow (`.github/workflows/deploy.yml`):

```yaml
on:
  push:
    branches: [main, master]
```

Bei jedem Push auf `main`/`master`:
1. Dependencies werden installiert
2. Production Build wird erstellt
3. Build Artifacts werden hochgeladen

### Deployment zu Strato/Render

**Option 1: Manuell**
1. Production Build erstellen: `npm run build`
2. Inhalt von `dist/public/` hochladen

**Option 2: GitHub Actions**
1. Code zu GitHub pushen
2. Workflow startet automatisch
3. Build Artifacts herunterladen und deployen

### Wichtige Dateien

- `dist/public/index.html` - Hauptdatei (enthält n8n Config)
- `dist/public/assets/` - JS und CSS Bundles
- `dist/public/images/` - Bilder
- `dist/public/videos/` - Videos
- `dist/public/favicon.svg` - Favicon

### Testen

Vor dem Deployment lokal testen:

```bash
# Development Server
npm run dev

# Production Build testen
npm run build
# Dann dist/public/index.html im Browser öffnen
```

### Bot Positionierung

Die Bots (Chat & Voice) sind **fix positioniert**:
- **Position**: Unten rechts
- **Responsive**: Funktioniert auf allen Geräten
- **Z-Index**: 2147483647 (höchste Priorität)

### Support

Bei Problemen:
1. CSP Headers überprüfen (müssen n8n.cloud erlauben)
2. Browser Console auf Fehler überprüfen
3. n8n Webhook URL testen

---

**Live-URL**: https://zoehagenkiconsulting.de
**Build Status**: ✅ Production Ready
