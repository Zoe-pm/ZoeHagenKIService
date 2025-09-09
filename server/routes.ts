import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertConsultationSchema } from "@shared/schema";
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

  // Chat endpoint for chatbot workflow
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Nachricht ist erforderlich" });
      }

      // Enhanced chatbot responses with more context about Zoë Hagen KI Consulting
      const responses: { [key: string]: string } = {
        "hallo": "Hallo! Schön, dass Sie da sind. Ich bin Zoes KI-Assistent und helfe Ihnen gerne bei Fragen zu unseren KI-Lösungen.",
        "chatbot": "Unser Chatbot kann Ihre Kunden 24/7 betreuen, Standardanfragen beantworten und Leads generieren. Interessiert Sie eine Demo?",
        "voicebot": "Der Voicebot ermöglicht natürliche Gespräche per Sprache und kann Anrufe entgegennehmen. Möchten Sie mehr erfahren?",
        "avatar": "Unser Avatar verleiht Ihrem Service ein menschliches Gesicht und baut Vertrauen zu Ihren Kunden auf. Soll ich Ihnen ein Beispiel zeigen?",
        "wissensbot": "Der Wissensbot bewahrt Ihr internes Wissen und macht es für Ihr Team jederzeit verfügbar. Haben Sie Fragen dazu?",
        "preis": "Unsere Chatbot-Lösung beginnt bei 299€ pro Monat. Für eine maßgeschneiderte Lösung erstelle ich gerne ein individuelles Angebot für Sie.",
        "termin": "Gerne können Sie einen Beratungstermin buchen! Nutzen Sie unser Kontaktformular oder rufen Sie uns unter +49 01719862773 an.",
        "öffnungszeiten": "Sie können uns jederzeit eine E-Mail an zoe-kiconsulting@pm.me senden. Für Telefonate sind wir Mo-Fr von 9-18 Uhr erreichbar.",
        "kontakt": "Sie erreichen uns unter +49 01719862773 oder per E-Mail: zoe-kiconsulting@pm.me. Wie kann ich Ihnen weiterhelfen?",
        "kosten": "Unsere KI-Lösungen beginnen bei 299€ monatlich. Je nach Ihren Anforderungen erstellen wir ein passendes Angebot. Soll ich Sie beraten?",
        "demo": "Gerne zeige ich Ihnen eine Demo unserer Lösungen! Welche interessiert Sie am meisten: Chatbot, Voicebot, Avatar oder Wissensbot?",
        "hilfe": "Ich helfe Ihnen gerne bei Fragen zu unseren KI-Assistenten. Was möchten Sie wissen: Funktionen, Preise, Demo oder Beratungstermin?",
        "tschüss": "Auf Wiedersehen! Falls Sie noch Fragen haben, bin ich jederzeit da. Besuchen Sie auch gerne unsere Website für mehr Informationen.",
        "danke": "Gerne! Ich bin immer da, wenn Sie Fragen haben. Möchten Sie mehr über unsere KI-Lösungen erfahren oder einen Termin buchen?",
        "default": "Das ist eine sehr gute Frage! Zoë Hagen KI Consulting bietet maßgeschneiderte KI-Lösungen für Unternehmen. Gerne können wir das in einem persönlichen Gespräch besprechen. Soll ich einen Termin für Sie arrangieren?"
      };

      let response = responses.default;
      const messageLower = message.toLowerCase();
      
      // Find matching response
      for (const [key, value] of Object.entries(responses)) {
        if (messageLower.includes(key)) {
          response = value;
          break;
        }
      }

      res.json({ success: true, response });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ success: false, message: "Chat-Service ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
