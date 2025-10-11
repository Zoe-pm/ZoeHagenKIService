# n8n Workflow Setup Anleitung

## ⚠️ WICHTIG: Workflow muss aktiviert sein!

Der n8n Webhook funktioniert **nur** wenn der Workflow **aktiv** ist.

## 🔧 Workflow aktivieren

1. **n8n Dashboard öffnen**: https://zoebahati.app.n8n.cloud
2. **Workflow finden**: "Chat Assistant" oder ähnlich
3. **Aktivieren**: Toggle-Switch oben rechts auf "Active" stellen
4. **Testen**: Webhook URL sollte jetzt funktionieren

## 📡 Webhook Details

**Production Webhook URL:**
```
https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat
```

**Request Format:**
```json
{
  "sessionId": "juna-1234567890-abc123",
  "chatInput": "Hallo, wer bist du?",
  "action": "sendMessage"
}
```

**Response Format:**
```json
{
  "output": "Ich bin Juna, Ihre KI-Assistentin...",
  "response": "..." 
}
```

## 🧪 Webhook testen

```bash
curl -X POST "https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"sessionId":"test-123","chatInput":"Hallo","action":"sendMessage"}'
```

**Erwartete Antwort (wenn aktiv):**
```json
{
  "output": "Hallo! Ich bin Juna..."
}
```

**Error 404 (wenn NICHT aktiv):**
```json
{
  "code": 404,
  "message": "The requested webhook is not registered.",
  "hint": "The workflow must be active for a production URL to run successfully..."
}
```

## 🔄 Development vs Production

### Development Mode (npm run dev)
- ✅ Nutzt **Server-Proxy** `/api/juna/chat`
- ✅ Funktioniert **ohne** n8n Workflow
- ✅ Benötigt `VAPI_API_KEY` in `.env`

### Production Mode (npm run build)
- ✅ Nutzt **n8n Webhook** direkt
- ⚠️ **Workflow MUSS aktiv sein!**
- ✅ Kein Server benötigt (Static Deployment)

## 🛠️ Troubleshooting

### Problem: "Entschuldigung, ich bin momentan nicht verfügbar"

**Ursache:** n8n Workflow ist nicht aktiv

**Lösung:**
1. n8n Dashboard öffnen
2. Workflow aktivieren (Toggle oben rechts)
3. Testen mit curl command oben
4. Wenn erfolgreich: Website neu laden

### Problem: CORS Fehler

**Ursache:** CSP Headers blockieren n8n

**Lösung:**
- Headers sind bereits konfiguriert in `server/index.ts`
- Production HTML hat CSP meta tag mit n8n.cloud erlaubt

### Problem: Falsches Response Format

**Ursache:** n8n Workflow gibt andere Struktur zurück

**Lösung:**
- JunaChatbot erwartet: `data.output` oder `data.response`
- n8n Workflow anpassen oder Code in JunaChatbot.tsx ändern

## 📝 Workflow Checklist

- [ ] n8n Dashboard geöffnet
- [ ] Workflow gefunden
- [ ] Workflow aktiviert (Toggle = Active)
- [ ] Webhook mit curl getestet
- [ ] Response Format überprüft
- [ ] Website getestet

## 🚀 Next Steps

1. **Workflow aktivieren** in n8n
2. **Website neu laden**
3. **Chatbot testen**
4. **Production deployen** wenn alles funktioniert

---

**Support**: Falls der Workflow nicht funktioniert, n8n Support kontaktieren oder einen neuen Webhook erstellen.
