import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAdminToken, generateTestToken, verifyToken, extractTokenFromAuth, ADMIN_PASSWORD } from "./auth";
import type { InsertTestCode, SendTestConfigRequest } from "@shared/schema";
import { sendTestConfigSchema } from "@shared/schema";
import { ELEVENLABS_VOICES } from "@shared/voices";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Login Route
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Passwort ist erforderlich' 
        });
      }
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiges Admin-Passwort' 
        });
      }
      
      const adminEmail = 'admin@zoeskiservice.de';
      const token = generateAdminToken(adminEmail);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      // Store session
      await storage.createAdminSession(token, adminEmail, expiresAt);
      
      res.json({
        success: true,
        token,
        message: 'Erfolgreich angemeldet'
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Admin Session Validation Route
  app.get('/api/admin/session', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Kein Token vorhanden' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Ungültiger oder abgelaufener Token' 
        });
      }
      
      const session = await storage.getAdminSession(token);
      if (!session) {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Session nicht gefunden' 
        });
      }
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await storage.deleteAdminSession(token);
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Session abgelaufen' 
        });
      }
      
      res.json({
        success: true,
        valid: true,
        email: session.email,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      console.error('Admin session validation error:', error);
      res.status(500).json({ 
        success: false, 
        valid: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Test Access Route
  app.post('/api/test-access', async (req, res) => {
    try {
      const { email, accessCode } = req.body;
      
      if (!email || !accessCode) {
        return res.status(400).json({ 
          success: false, 
          message: 'E-Mail und Zugriffscode sind erforderlich' 
        });
      }
      
      // Check if test code exists and is valid for this email (normalize inputs)
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedCode = accessCode.trim().toUpperCase();
      const testCode = await storage.getTestCodeByEmail(normalizedEmail, normalizedCode);
      
      if (!testCode) {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiger Code oder E-Mail. Bitte kontaktieren Sie Zoë\'s KI Service für einen gültigen Testzugang.' 
        });
      }
      
      if (!testCode.isActive || new Date(testCode.expiresAt) < new Date()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Der Testcode ist abgelaufen. Bitte kontaktieren Sie Zoë\'s KI Service für einen neuen Testzugang.' 
        });
      }
      
      // Generate test token
      const token = generateTestToken(normalizedEmail);
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      
      // Store test session with n8n configuration
      await storage.createTestSession(token, normalizedEmail, expiresAt, {
        webhookUrl: testCode.n8nWebhookUrl,
        botName: testCode.n8nBotName, 
        botGreeting: testCode.n8nBotGreeting
      });
      
      res.json({
        success: true,
        token,
        expiresAt,
        message: 'Zugang gewährt',
        // Include n8n configuration in response
        n8nWebhookUrl: testCode.n8nWebhookUrl,
        n8nBotName: testCode.n8nBotName,
        n8nBotGreeting: testCode.n8nBotGreeting
      });
    } catch (error) {
      console.error('Test access error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Test Session Validation Route
  app.get('/api/test-session', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Kein Token vorhanden' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'test') {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Ungültiger oder abgelaufener Token' 
        });
      }
      
      const session = await storage.getTestSession(token);
      if (!session) {
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Session nicht gefunden' 
        });
      }
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await storage.deleteTestSession(token);
        return res.status(401).json({ 
          success: false, 
          valid: false, 
          message: 'Session abgelaufen' 
        });
      }
      
      res.json({
        success: true,
        valid: true,
        email: session.email,
        expiresAt: session.expiresAt,
        // Include n8n configuration
        n8nWebhookUrl: session.n8nWebhookUrl,
        n8nBotName: session.n8nBotName,
        n8nBotGreeting: session.n8nBotGreeting
      });
    } catch (error) {
      console.error('Test session validation error:', error);
      res.status(500).json({ 
        success: false, 
        valid: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Close test session endpoint (for proper session lifecycle)
  app.post('/api/test-session/close', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token required' 
        });
      }

      // Delete the test session
      await storage.deleteTestSession(token);
      
      console.log(`Test session closed: ${token.substring(0, 10)}...`);
      
      res.json({
        success: true,
        message: 'Session closed'
      });
    } catch (error) {
      console.error('Test session close error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Admin Testcode Management Routes
  
  // Get all test codes
  app.get('/api/admin/testcodes', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorisiert' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiger Admin-Token' 
        });
      }
      
      const testCodes = await storage.getAllTestCodes();
      
      res.json({
        success: true,
        data: testCodes
      });
    } catch (error) {
      console.error('Get test codes error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Create test code
  app.post('/api/admin/testcodes', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorisiert' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiger Admin-Token' 
        });
      }
      
      const { code, emails, customerName, customerCompany, expiresInHours, sendEmail, n8nWebhookUrl, n8nBotName, n8nBotGreeting } = req.body;
      
      if (!code || !emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Code und E-Mail-Adressen sind erforderlich' 
        });
      }
      
      // Check if code already exists (normalize to uppercase)
      const existingCode = await storage.getTestCode(code.trim().toUpperCase());
      if (existingCode) {
        return res.status(400).json({ 
          success: false, 
          message: 'Test-Code existiert bereits' 
        });
      }
      
      const insertTestCode: InsertTestCode = {
        code: code.trim().toUpperCase(),
        emails: emails.map(email => email.trim().toLowerCase()),
        customerName,
        customerCompany,
        expiresInHours: expiresInHours || 72,
        sendEmail,
        n8nWebhookUrl,
        n8nBotName,
        n8nBotGreeting
      };
      
      const newTestCode = await storage.createTestCode(insertTestCode);
      
      // TODO: If sendEmail is true, implement email sending here
      if (sendEmail) {
        console.log('TODO: Implement email sending for test code:', code);
      }
      
      res.json({
        success: true,
        data: newTestCode,
        message: 'Test-Code erfolgreich erstellt'
      });
    } catch (error) {
      console.error('Create test code error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Delete test code
  app.delete('/api/admin/testcodes/:code', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorisiert' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiger Admin-Token' 
        });
      }
      
      const { code } = req.params;
      
      const existingCode = await storage.getTestCode(code.trim().toUpperCase());
      if (!existingCode) {
        return res.status(404).json({ 
          success: false, 
          message: 'Test-Code nicht gefunden' 
        });
      }
      
      await storage.deleteTestCode(code.trim().toUpperCase());
      
      res.json({
        success: true,
        message: 'Test-Code erfolgreich gelöscht'
      });
    } catch (error) {
      console.error('Delete test code error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Test Configuration Send Route
  app.post('/api/test-config/send', async (req, res) => {
    try {
      const token = extractTokenFromAuth(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Kein Token vorhanden' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload || payload.type !== 'test') {
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültiger oder abgelaufener Token' 
        });
      }
      
      // Validate session exists
      const session = await storage.getTestSession(token);
      if (!session) {
        return res.status(401).json({ 
          success: false, 
          message: 'Session nicht gefunden' 
        });
      }
      
      // Validate request body with Zod
      const validation = sendTestConfigSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ungültige Konfigurationsdaten',
          errors: validation.error.errors
        });
      }
      
      const configData = validation.data;
      
      // Save configuration
      await storage.saveTestConfig(session.email, configData);
      
      console.log(`Test configuration saved for ${session.email}:`, {
        activeBot: configData.testConfig.activeBot,
        botName: configData.testConfig.activeBot === 'chatbot' 
          ? configData.testConfig.chatbot.name 
          : configData.testConfig.voicebot.name,
        hasN8nWebhook: !!configData.n8nWebhookUrl
      });
      
      res.json({
        success: true,
        message: 'Konfiguration erfolgreich gespeichert und gesendet'
      });
    } catch (error) {
      console.error('Test config send error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Server-Fehler' 
      });
    }
  });

  // Production Chatbot Route
  app.post('/api/prod-chatbot', async (req, res) => {
    try {
      const { message, botName, sessionId } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nachricht und Session-ID sind erforderlich' 
        });
      }
      
      // Demo responses for Juna
      const demoResponses = [
        "Hallo! Ich bin Juna von Zoë's KI Service. Wie kann ich Ihnen heute helfen?",
        "Unsere KI-Assistenten können Ihrem Unternehmen 24/7 zur Verfügung stehen. Möchten Sie mehr über unsere Lösungen erfahren?",
        "Wir bieten maßgeschneiderte Chatbots, Voicebots und KI-Avatare. Welcher Bereich interessiert Sie am meisten?",
        "Gerne vereinbare ich einen Termin für Sie. Soll ich Ihnen unseren Kalender zeigen?",
        "Unsere KI-Lösungen helfen dabei, Kundenanfragen automatisch zu bearbeiten und Ihr Team zu entlasten.",
        "Haben Sie Fragen zu unseren Preisen oder möchten Sie eine individuelle Beratung?"
      ];
      
      // Simple response logic based on message content
      let response = demoResponses[0]; // Default
      
      if (message.toLowerCase().includes('preis') || message.toLowerCase().includes('kosten')) {
        response = "Unsere Preise richten sich nach Ihren individuellen Anforderungen. Gerne erstelle ich Ihnen ein kostenloses Angebot. Soll ich einen Beratungstermin für Sie buchen?";
      } else if (message.toLowerCase().includes('termin') || message.toLowerCase().includes('beratung')) {
        response = "Sehr gerne! Ich kann Ihnen direkt einen Termin anbieten. Klicken Sie auf 'Termin buchen' und wählen Sie einen passenden Zeitpunkt.";
      } else if (message.toLowerCase().includes('chatbot') || message.toLowerCase().includes('bot')) {
        response = "Unsere Chatbots sind perfekt für die Kundenbetreuung geeignet. Sie arbeiten 24/7, sprechen mehrere Sprachen und lernen ständig dazu. Möchten Sie eine Demo sehen?";
      } else if (message.toLowerCase().includes('voice') || message.toLowerCase().includes('sprache')) {
        response = "Unsere Voicebots können telefonische Anfragen automatisch bearbeiten. Sie klingen natürlich und verstehen komplexe Anliegen. Sehr praktisch für Support und Terminbuchungen!";
      } else if (message.toLowerCase().includes('hallo') || message.toLowerCase().includes('hi')) {
        response = "Hallo! Schön, dass Sie da sind. Ich bin Juna und berate Sie gerne zu unseren KI-Lösungen. Was interessiert Sie am meisten?";
      } else {
        // Random response from array
        response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      }
      
      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      res.json({
        success: true,
        response: response,
        sessionId: sessionId
      });
      
    } catch (error) {
      console.error('Production chatbot error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Verarbeiten der Nachricht' 
      });
    }
  });

  // ElevenLabs Voices API - Static voice list
  app.get('/api/tts/elevenlabs/voices', async (req, res) => {
    try {
      res.json({ 
        success: true, 
        voices: ELEVENLABS_VOICES 
      });
    } catch (error) {
      console.error('ElevenLabs voices error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Fehler beim Laden der Stimmen' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
