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

  // Chat endpoint for chatbot workflow - connected to n8n
  app.post("/api/chat", async (req, res) => {
    try {
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

  const httpServer = createServer(app);
  return httpServer;
}
