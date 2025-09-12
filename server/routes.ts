import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertConsultationSchema, testAccessSchema, testSessionSchema, testConfigSaveSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Consultation booking
  app.post("/api/consultation", async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(consultationData);
      res.status(201).json({ success: true, consultation });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Test config save endpoint
  app.post("/api/test-config", async (req, res) => {
    try {
      const { email, sessionToken, config } = testConfigSaveSchema.parse(req.body);
      
      // Validate session
      const session = await storage.getTestSession(sessionToken);
      if (!session) {
        return res.status(401).json({ success: false, message: "Ungültiges oder abgelaufenes Token" });
      }
      
      // Generate a unique reference ID
      const referenceId = `ZKS-${Date.now().toString().slice(-6)}`;
      
      // Store config (in memory for now - in production this would be saved to database)
      console.log(`Config saved for ${email} with reference: ${referenceId}`, {
        activeBot: config.activeBot,
        botName: config.activeBot === "chatbot" ? config.chatbot.name : config.voicebot.name
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Konfiguration erfolgreich gespeichert",
        referenceId,
        email: session.email
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        console.error("Config save error:", error);
        res.status(500).json({ success: false, message: "Server-Fehler beim Speichern der Konfiguration" });
      }
    }
  });

  // Voice demo endpoint
  app.post("/api/voice-demo", async (req, res) => {
    try {
      const { question } = req.body;
      
      // Simple demo responses for different questions
      const responses: { [key: string]: string } = {
        "öffnungszeiten": "Unsere Öffnungszeiten sind Montag bis Freitag von 9:00 bis 18:00 Uhr.",
        "termin": "Sie können einen Termin über unser Kontaktformular oder telefonisch unter +49 123 456 789 buchen.",
        "kosten": "Unsere Preise beginnen bei 299€ pro Monat für den Chatbot. Gerne erstellen wir Ihnen ein individuelles Angebot.",
        "unternehmen": "Wir sind KI-Assistenten GmbH, spezialisiert auf professionelle KI-Lösungen für Unternehmen. Mit über 5 Jahren Erfahrung haben wir bereits 200+ Unternehmen geholfen.",
        "default": "Das ist eine interessante Frage. Gerne können Sie uns für eine detaillierte Beratung kontaktieren."
      };

      let response = responses.default;
      const questionLower = question.toLowerCase();
      
      for (const [key, value] of Object.entries(responses)) {
        if (questionLower.includes(key)) {
          response = value;
          break;
        }
      }

      res.json({ success: true, response });
    } catch (error) {
      res.status(500).json({ success: false, message: "Voice demo error" });
    }
  });

  // Test access validation endpoint
  app.post("/api/test-access", async (req, res) => {
    try {
      const { email, accessCode } = testAccessSchema.parse(req.body);
      
      const session = await storage.createTestSession(email, accessCode);
      
      res.status(201).json({ 
        success: true, 
        token: session.token,
        expiresAt: session.expiresAt.toISOString(),
        // Include n8n configuration from TestAccessGrant
        n8nWebhookUrl: session.n8nWebhookUrl,
        n8nBotName: session.n8nBotName,
        n8nBotGreeting: session.n8nBotGreeting
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else if (error instanceof Error && error.message.includes("Ungültiger")) {
        res.status(401).json({ success: false, message: error.message });
      } else {
        console.error("Test access error:", error);
        res.status(500).json({ success: false, message: "Server-Fehler bei der Authentifizierung" });
      }
    }
  });

  // Test session validation endpoint
  app.get("/api/test-session", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token as string;
      
      if (!token) {
        return res.status(401).json({ success: false, message: "Kein Token bereitgestellt" });
      }
      
      const session = await storage.getTestSession(token);
      
      if (!session) {
        return res.status(401).json({ success: false, message: "Ungültiges oder abgelaufenes Token" });
      }
      
      res.json({ 
        success: true, 
        valid: true,
        email: session.email,
        expiresAt: session.expiresAt.toISOString(),
        // Include n8n configuration to prevent config loss after refresh
        n8nWebhookUrl: session.n8nWebhookUrl,
        n8nBotName: session.n8nBotName,
        n8nBotGreeting: session.n8nBotGreeting
      });
    } catch (error) {
      console.error("Session validation error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler bei der Session-Validierung" });
    }
  });

  // Chat endpoint for chatbot workflow - connected to n8n (with session validation)
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate session token for secure access
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.body.token;
      
      if (!token) {
        return res.status(401).json({ success: false, message: "Authentifizierung erforderlich" });
      }
      
      const session = await storage.getTestSession(token);
      if (!session) {
        return res.status(401).json({ success: false, message: "Ungültiges oder abgelaufenes Token" });
      }

      const { message } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Nachricht ist erforderlich" });
      }

      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.error("N8N_WEBHOOK_URL not configured");
        return res.status(500).json({ 
          success: false, 
          message: "Chatbot-Service ist nicht konfiguriert. Bitte kontaktieren Sie den Support." 
        });
      }

      // Send message to n8n workflow
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          source: 'website-chatbot'
        }),
      });

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook responded with status ${n8nResponse.status}`);
      }

      const n8nData = await n8nResponse.json();
      
      // Extract response from n8n workflow
      // Adjust this based on your n8n workflow output structure
      let botResponse = "Entschuldigung, ich konnte keine Antwort generieren.";
      
      if (n8nData && n8nData.response) {
        botResponse = n8nData.response;
      } else if (n8nData && n8nData.message) {
        botResponse = n8nData.message;
      } else if (n8nData && typeof n8nData === 'string') {
        botResponse = n8nData;
      }

      res.json({ success: true, response: botResponse });

    } catch (error) {
      console.error("n8n webhook error:", error);
      
      // Fallback responses when n8n is not available
      const fallbackResponses: { [key: string]: string } = {
        "hallo": "Hallo! Entschuldigung, mein KI-System wird gerade aktualisiert. Kontaktieren Sie uns gerne direkt unter +49 01719862773.",
        "kontakt": "Sie erreichen uns unter +49 01719862773 oder per E-Mail: zoe-kiconsulting@pm.me",
        "termin": "Für einen Beratungstermin rufen Sie uns bitte unter +49 01719862773 an.",
        "default": "Entschuldigung, mein KI-System ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt: +49 01719862773 oder zoe-kiconsulting@pm.me"
      };

      const messageLower = req.body.message?.toLowerCase() || "";
      let fallbackResponse = fallbackResponses.default;
      
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (messageLower.includes(key)) {
          fallbackResponse = value;
          break;
        }
      }

      res.json({ success: true, response: fallbackResponse });
    }
  });

  // Admin API Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      const isValid = await storage.validateAdminLogin(password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Ungültiges Admin-Passwort" });
      }
      
      const token = await storage.createAdminSession();
      res.json({ success: true, token });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.get("/api/admin/session", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ success: false, message: "Kein Token bereitgestellt" });
      }
      
      const isValid = await storage.validateAdminSession(token);
      res.json({ success: true, valid: isValid });
    } catch (error) {
      console.error("Admin session validation error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.get("/api/admin/testcodes", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !(await storage.validateAdminSession(token))) {
        return res.status(401).json({ success: false, message: "Nicht autorisiert" });
      }
      
      const testCodes = await storage.getAllTestCodes();
      res.json({ success: true, data: testCodes });
    } catch (error) {
      console.error("Get test codes error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.post("/api/admin/testcodes", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !(await storage.validateAdminSession(token))) {
        return res.status(401).json({ success: false, message: "Nicht autorisiert" });
      }
      
      const { code, emails, customerName, customerCompany, expiresInHours, sendEmail, n8nWebhookUrl, n8nBotName, n8nBotGreeting } = req.body;
      
      await storage.createTestCode(code, emails, customerName, customerCompany, expiresInHours, n8nWebhookUrl, n8nBotName, n8nBotGreeting);
      
      // E-Mail versenden wenn gewünscht
      if (sendEmail && emails.length > 0) {
        const { sendTestCodeEmail } = await import('./sendgrid');
        const validUntil = new Date(Date.now() + (expiresInHours || 72) * 60 * 60 * 1000).toLocaleDateString('de-DE');
        
        for (const email of emails) {
          await sendTestCodeEmail({
            customerName: customerName || 'Kunde',
            customerEmail: email,
            testCode: code,
            validUntil,
            loginUrl: `${req.protocol}://${req.get('host')}/test`
          });
        }
      }
      
      res.json({ success: true, message: "Test-Code erfolgreich erstellt" });
    } catch (error) {
      console.error("Create test code error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.delete("/api/admin/testcodes/:code", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !(await storage.validateAdminSession(token))) {
        return res.status(401).json({ success: false, message: "Nicht autorisiert" });
      }
      
      await storage.deleteTestCode(req.params.code);
      res.json({ success: true, message: "Test-Code gelöscht" });
    } catch (error) {
      console.error("Delete test code error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.get("/api/admin/sessions", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !(await storage.validateAdminSession(token))) {
        return res.status(401).json({ success: false, message: "Nicht autorisiert" });
      }
      
      const sessions = await storage.getAllActiveSessions();
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  app.get("/api/admin/usage/:code", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || !(await storage.validateAdminSession(token))) {
        return res.status(401).json({ success: false, message: "Nicht autorisiert" });
      }
      
      const usage = await storage.getTestCodeUsage(req.params.code);
      res.json({ success: true, data: usage });
    } catch (error) {
      console.error("Get usage error:", error);
      res.status(500).json({ success: false, message: "Server-Fehler" });
    }
  });

  // Production chatbot endpoint (n8n webhook proxy)
  app.post("/api/prod-chatbot", async (req, res) => {
    try {
      // Validate request body
      const prodChatSchema = z.object({
        message: z.string().min(1, "Message ist erforderlich").max(2000, "Message zu lang"),
        botName: z.string().optional(),
        sessionId: z.string().optional()
      });

      const validatedData = prodChatSchema.parse(req.body);
      const { message } = validatedData;

      const webhookUrl = process.env.N8N_WEBHOOK_URL_PROD;
      if (!webhookUrl) {
        return res.status(500).json({ success: false, message: "Produktions-Webhook nicht konfiguriert" });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': req.body.sessionId || 'juna-fallback-session'
        },
        body: JSON.stringify({
          message: message,
          botName: req.body.botName || "Juna Zoë's KI Studio Assistant",
          sessionId: req.body.sessionId || 'juna-fallback-session',
          session_id: req.body.sessionId || 'juna-fallback-session',
          timestamp: new Date().toISOString(),
          source: 'website-chatbot'
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        return res.status(502).json({ success: false, message: "Chatbot ist momentan nicht erreichbar" });
      }

      const data = await response.json();
      
      // Parse n8n response - try multiple field names for compatibility
      const botResponse = data.output || data.response || data.message || data.text || data.answer || 'Entschuldigung, keine Antwort erhalten.';

      res.json({ success: true, response: botResponse });
      
    } catch (error) {
      console.error('Production chatbot error:', error);
      res.status(502).json({ 
        success: false, 
        message: "Chatbot ist momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt: +49 01719862773" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
