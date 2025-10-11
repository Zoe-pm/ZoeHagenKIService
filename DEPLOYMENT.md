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

### Deployment zu Hosting-Plattformen

**🔥 WICHTIG: CSP Headers für n8n!**

Der Chatbot funktioniert NUR wenn die richtigen CSP Headers gesetzt sind!

#### Render.com
1. `render.yaml` ist bereits konfiguriert
2. Push zu GitHub → Render deployt automatisch
3. Headers werden automatisch gesetzt ✅

#### Netlify
1. `netlify.toml` und `dist/public/_headers` sind konfiguriert
2. Push zu GitHub → Netlify deployt automatisch
3. Headers werden automatisch gesetzt ✅

#### Vercel
1. `vercel.json` ist konfiguriert
2. Import GitHub Repo in Vercel
3. Build command: `npm run build`
4. Output directory: `dist/public`
5. Headers werden automatisch gesetzt ✅

#### Andere Static Hosts (Strato, etc.)
1. Production Build: `npm run build`
2. Uploade `dist/public/` Inhalt
3. **Wichtig**: Manuell CSP Headers setzen:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://zoebahati.app.n8n.cloud wss://zoebahati.app.n8n.cloud; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https: blob:; frame-src 'self' https://calendly.com;
```

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

### Troubleshooting: Chatbot funktioniert nicht live

**Problem**: Chatbot funktioniert in Preview, aber nicht nach Deployment

**Ursache**: CSP Headers blockieren n8n Verbindung

**Lösung**:

1. **Browser Console öffnen** (F12)
2. **CSP Fehler suchen**:
   ```
   Refused to connect to 'https://zoebahati.app.n8n.cloud/...' because it violates the following Content Security Policy directive: "connect-src 'self'"
   ```

3. **CSP Headers korrekt setzen**:
   - **Render**: `render.yaml` committen und pushen
   - **Netlify**: `netlify.toml` committen und pushen
   - **Vercel**: `vercel.json` committen und pushen
   - **Andere**: Manuell im Server/Host-Panel setzen

4. **n8n Workflow aktivieren**:
   - https://zoebahati.app.n8n.cloud
   - Workflow MUSS aktiv sein (Toggle oben rechts)

5. **Testen**:
   ```bash
   # Browser Console
   fetch('https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({sessionId: 'test', message: 'Hallo'})
   }).then(r => r.json()).then(console.log)
   ```

**Erwartete Ausgabe**: `{output: "Hallo! ..."}`

### Support

Bei Problemen:
1. **CSP Headers überprüfen** (müssen `https://zoebahati.app.n8n.cloud` erlauben)
2. **Browser Console** auf Fehler überprüfen
3. **n8n Webhook testen** (siehe oben)
4. **n8n Workflow** muss AKTIV sein

---

**Live-URL**: https://zoehagenkiconsulting.de
**Build Status**: ✅ Production Ready
