# ⚠️ AKTUELLES PROBLEM: n8n Workflow Error

## Status: CHATBOT FUNKTIONIERT NICHT

Der Juna **Chatbot** (n8n) zeigt aktuell einen Fehler.

## Problem Details

**Error Response vom n8n Webhook:**
```json
{
  "message": "Error in workflow"
}
```

**HTTP Status:** 500 Internal Server Error

## Was funktioniert:

✅ Frontend öffnet sich korrekt  
✅ Chat-UI ist responsive  
✅ Server Proxy leitet Anfragen weiter  
✅ n8n Webhook ist erreichbar  
✅ Secret `N8N_WEBHOOK_URL` ist konfiguriert

## Was NICHT funktioniert:

❌ n8n Workflow gibt `500 Error` zurück  
❌ Bot kann keine Antworten generieren  
❌ User sieht Fehlermeldung: "Entschuldigung, ich bin momentan nicht verfügbar..."

## Ursache

Der **n8n Workflow selbst hat einen internen Fehler**. Das kann sein:
- ❌ Workflow ist fehlerhaft konfiguriert
- ❌ Ein Node im Workflow fehlt oder ist falsch verbunden
- ❌ AI/LLM Service ist nicht konfiguriert
- ❌ Request-Parameter passen nicht zum Workflow

## Lösung (für Sie)

### Schritt 1: n8n Dashboard öffnen
```
https://zoebahati.app.n8n.cloud
```

### Schritt 2: Workflow finden
- Name: "Chat Assistant" oder ähnlich
- Webhook URL sollte enden mit: `/chat`

### Schritt 3: Workflow Executions prüfen
1. Klick auf "Executions" (oben rechts)
2. Letzte fehlgeschlagene Execution öffnen
3. Fehler-Meldung lesen

### Schritt 4: Häufige Fehler beheben

**Fehlende AI/LLM Connection:**
- Node "OpenAI" / "ChatGPT" / andere AI muss konfiguriert sein
- API Key muss hinterlegt sein

**Falscher Input:**
- Webhook sollte `message` oder `chatInput` Parameter erwarten
- Prüfen Sie die Workflow-Inputs

**Fehlende Nodes:**
- Webhook Node → AI/LLM Node → Respond Node
- Alle müssen verbunden sein

### Schritt 5: Workflow testen

Nach Fix:
1. Workflow speichern
2. Workflow aktivieren (Toggle oben rechts)
3. Test mit curl:

```bash
curl -X POST "https://zoebahati.app.n8n.cloud/webhook/fd03b457-7f60-409a-ae7d-e9974b6e807c/chat" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"Hallo"}'
```

**Erwartete Antwort:**
```json
{
  "output": "Hallo! Ich bin Juna...",
  "response": "..."
}
```

### Schritt 6: Website neu laden

Wenn curl Test erfolgreich → Website neu laden und Chatbot testen

## Alternative: Voicebot verwenden

Während der Chatbot repariert wird, können Nutzer den **Voicebot** (Vapi.ai) verwenden:
- Button rechts neben dem Chat-Button
- Funktioniert mit Spracheingabe
- Benötigt `VAPI_API_KEY` Secret

---

**Wichtig:** Der Code ist korrekt. Das Problem liegt im **n8n Workflow selbst**, nicht in dieser Replit-Anwendung.

Bei Fragen: Siehe `N8N_SETUP.md` für Details
