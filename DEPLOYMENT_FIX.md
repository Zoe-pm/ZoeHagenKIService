# 🔧 FIX: Chatbot funktioniert nicht auf Render/GitHub/Netlify

## Problem

Der Chatbot funktioniert in der Replit Preview, aber **NICHT** nach dem Deployment auf Render/GitHub Pages/Netlify.

### Grund

**CSP Headers blockieren die n8n Verbindung!**

Der Browser blockiert die Verbindung zum n8n Webhook, weil die Content Security Policy (CSP) Headers nicht richtig gesetzt sind.

## Lösung

### Schritt 1: CSP Headers hinzufügen

Je nach Hosting-Plattform:

#### **Render.com** ✅
Die `render.yaml` Datei ist bereits im Projekt vorhanden:
1. Committe alle Dateien zu GitHub
2. Push zu GitHub
3. Render deployt automatisch mit den richtigen Headers

#### **Netlify** ✅
Die `netlify.toml` und `dist/public/_headers` Dateien sind vorhanden:
1. Committe alle Dateien zu GitHub
2. Push zu GitHub
3. Netlify deployt automatisch mit den richtigen Headers

#### **Vercel** ✅
Die `vercel.json` Datei ist vorhanden:
1. Import GitHub Repo in Vercel
2. Build command: `npm run build`
3. Output directory: `dist/public`
4. Deploy

#### **GitHub Pages**
1. Erstelle `.github/workflows/deploy-gh-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Add CSP headers file
        run: |
          cat > dist/public/_headers << 'EOF'
          /*
            Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://zoebahati.app.n8n.cloud wss://zoebahati.app.n8n.cloud; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https: blob:; frame-src 'self' https://calendly.com;
          EOF
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

2. Aktiviere GitHub Pages in Repository Settings → Pages → Source: gh-pages branch

⚠️ **WICHTIG**: GitHub Pages unterstützt KEINE custom Headers! Der Chatbot wird auf GitHub Pages **NICHT** funktionieren. Nutzen Sie stattdessen Netlify, Render oder Vercel.

### Schritt 2: n8n Workflow aktivieren

1. Gehe zu https://zoebahati.app.n8n.cloud
2. Öffne den Workflow
3. **Aktiviere den Workflow** (Toggle oben rechts muss GRÜN sein)

### Schritt 3: Testen

Nach dem Deployment:

1. Öffne die Live-Website
2. Öffne Browser DevTools (F12)
3. Wechsle zum **Console** Tab
4. Führe diesen Test aus:

```javascript
fetch('https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({sessionId: 'test', chatInput: 'Hallo', action: 'sendMessage'})
}).then(r => r.json()).then(console.log)
```

**Erwartete Ausgabe**: `{output: "Hallo! ..."}`

Wenn das funktioniert, sollte auch der Chatbot funktionieren!

## Fehlersuche

### Fehler: "Refused to connect to 'https://zoebahati.app.n8n.cloud'"

**Problem**: CSP Headers blockieren n8n

**Lösung**: 
- Stelle sicher, dass die richtige Konfigurationsdatei vorhanden ist (siehe Schritt 1)
- Re-deploye die Website
- Prüfe im Network Tab, ob die Response Headers die CSP enthalten

### Fehler: 404 - Webhook not registered

**Problem**: n8n Workflow ist NICHT aktiv

**Lösung**: 
1. https://zoebahati.app.n8n.cloud
2. Workflow aktivieren (Toggle oben rechts)

### Fehler: 500 - Error in workflow

**Problem**: n8n Workflow hat einen internen Fehler

**Lösung**:
1. n8n Dashboard → Executions
2. Letzte fehlgeschlagene Execution öffnen
3. Fehler beheben

## Deployment Checklist

Vor dem Go-Live:

- [ ] n8n Workflow ist AKTIV
- [ ] Richtige Konfigurationsdatei für Hosting-Plattform vorhanden
- [ ] Production Build erstellt: `npm run build`
- [ ] `dist/public/_headers` Datei vorhanden
- [ ] Deployed zu Hosting-Plattform
- [ ] Browser Test durchgeführt (siehe Schritt 3)
- [ ] Chatbot öffnet sich und antwortet

## Empfohlene Hosting-Plattformen

1. **Render.com** - ✅ Beste Option (CSP Support, Gratis-Tier)
2. **Netlify** - ✅ Sehr gut (CSP Support, Gratis-Tier)
3. **Vercel** - ✅ Gut (CSP Support, Gratis-Tier)
4. **GitHub Pages** - ❌ NICHT geeignet (Keine CSP Support)

## Kontakt

Bei Fragen: Siehe `N8N_SETUP.md` und `DEPLOYMENT.md`
