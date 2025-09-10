import { type User, type InsertUser, type InsertContact, type InsertConsultation, type Product } from "@shared/schema";
import { randomUUID } from "crypto";

// Contact type for storage
type Contact = InsertContact & { id: string; createdAt: Date };
type Consultation = InsertConsultation & { id: string; createdAt: Date };

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Consultation methods
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private consultations: Map<string, Consultation>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.consultations = new Map();
    this.products = new Map();
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      createdAt: new Date() 
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "chatbot",
        name: "Chatbot",
        description: "Intelligenter KI-Assistent für Ihre Website",
        price: "ab 299€ / Monat",
        features: ["24/7 Support", "Anpassbare Antworten", "Mehrsprachig", "Analytics"],
        implementationTime: "2-4 Wochen",
        targetAudience: "Kleine bis mittlere Unternehmen",
        useCases: ["Kundensupport", "FAQ-Beantwortung", "Lead-Generierung"],
        integrations: ["Website", "WhatsApp", "Facebook Messenger"]
      },
      {
        id: "voicebot",
        name: "Voicebot",
        description: "Sprachbasierter KI-Assistent für natürliche Kommunikation",
        price: "ab 499€ / Monat",
        features: ["Natürliche Sprache", "Mehrsprachig", "Telefonintegration", "Sentiment-Analyse"],
        implementationTime: "3-6 Wochen",
        targetAudience: "Service-orientierte Unternehmen",
        useCases: ["Telefonischer Support", "Terminbuchung", "Informationsabfrage"],
        integrations: ["Telefonsystem", "CRM", "Kalendersysteme"]
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }
}

export const storage = new MemStorage();
