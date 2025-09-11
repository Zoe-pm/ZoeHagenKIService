import { type User, type InsertUser, type InsertContact, type InsertConsultation, type Product, type TestAccessRequest, type TestAccessGrant, type TestCodeInfo, type TestCodeUsage } from "@shared/schema";
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
  
  // Test access methods
  validateTestAccess(email: string, accessCode: string): Promise<boolean>;
  createTestSession(email: string, accessCode: string): Promise<TestAccessGrant>;
  getTestSession(token: string): Promise<TestAccessGrant | undefined>;
  cleanupExpiredSessions(): Promise<void>;
  
  // Admin methods
  validateAdminLogin(password: string): Promise<boolean>;
  createAdminSession(): Promise<string>;
  validateAdminSession(token: string): Promise<boolean>;
  createTestCode(code: string, emails: string[], customerName?: string, customerCompany?: string, expiresInHours?: number, n8nWebhookUrl?: string, n8nBotName?: string, n8nBotGreeting?: string): Promise<void>;
  deleteTestCode(code: string): Promise<void>;
  getAllTestCodes(): Promise<TestCodeInfo[]>;
  getTestCodeUsage(code: string): Promise<TestCodeUsage>;
  getAllActiveSessions(): Promise<TestAccessGrant[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private consultations: Map<string, Consultation>;
  private products: Map<string, Product>;
  private testSessions: Map<string, TestAccessGrant>;
  private validTestCodes: Map<string, string[]>; // code -> allowed emails
  private testCodeDetails: Map<string, TestCodeInfo>;
  private adminSessions: Map<string, { token: string; expiresAt: Date }>;
  private testCodeUsageStats: Map<string, { logins: Set<string>; lastAccess?: Date }>;
  private readonly adminPassword = process.env.ADMIN_PASSWORD || 'ZKS-Admin2024!'; // Temporäres Admin-Passwort

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.consultations = new Map();
    this.products = new Map();
    this.testSessions = new Map();
    this.validTestCodes = new Map();
    this.testCodeDetails = new Map();
    this.adminSessions = new Map();
    this.testCodeUsageStats = new Map();
    
    // Initialize with some sample products
    this.initializeProducts();
    
    // Initialize secure test codes
    this.initializeTestCodes();
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

  async validateTestAccess(email: string, accessCode: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const upperCode = accessCode.toUpperCase().trim();
    
    const allowedEmails = this.validTestCodes.get(upperCode);
    return allowedEmails ? allowedEmails.includes(normalizedEmail) : false;
  }

  async createTestSession(email: string, accessCode: string): Promise<TestAccessGrant> {
    const isValid = await this.validateTestAccess(email, accessCode);
    if (!isValid) {
      throw new Error("Ungültiger Zugriffscode oder Email-Adresse");
    }

    const id = randomUUID();
    const token = randomUUID() + randomUUID().replace(/-/g, ''); // Double UUID for extra security
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Get n8n configuration from test code details
    const testCodeInfo = this.testCodeDetails.get(accessCode.toUpperCase().trim());
    
    const session: TestAccessGrant = {
      id,
      email: email.toLowerCase().trim(),
      accessCode: accessCode.toUpperCase().trim(),
      token,
      createdAt,
      expiresAt,
      // n8n Integration from test code
      n8nWebhookUrl: testCodeInfo?.n8nWebhookUrl,
      n8nBotName: testCodeInfo?.n8nBotName,
      n8nBotGreeting: testCodeInfo?.n8nBotGreeting
    };

    this.testSessions.set(token, session);
    
    // Cleanup expired sessions periodically
    setTimeout(() => this.cleanupExpiredSessions(), 0);
    
    return session;
  }

  async getTestSession(token: string): Promise<TestAccessGrant | undefined> {
    const session = this.testSessions.get(token);
    
    if (!session) {
      return undefined;
    }
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.testSessions.delete(token);
      return undefined;
    }
    
    return session;
  }

  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [token, session] of Array.from(this.testSessions.entries())) {
      if (session.expiresAt < now) {
        this.testSessions.delete(token);
      }
    }
  }

  // Admin methods implementation
  async validateAdminLogin(password: string): Promise<boolean> {
    return password === this.adminPassword;
  }

  async createAdminSession(): Promise<string> {
    const token = randomUUID() + randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
    this.adminSessions.set(token, { token, expiresAt });
    return token;
  }

  async validateAdminSession(token: string): Promise<boolean> {
    const session = this.adminSessions.get(token);
    if (!session) return false;
    
    if (session.expiresAt < new Date()) {
      this.adminSessions.delete(token);
      return false;
    }
    return true;
  }

  async createTestCode(
    code: string, 
    emails: string[], 
    customerName?: string, 
    customerCompany?: string, 
    expiresInHours: number = 72,
    n8nWebhookUrl?: string,
    n8nBotName?: string,
    n8nBotGreeting?: string
  ): Promise<void> {
    const normalizedCode = code.toUpperCase().trim();
    const normalizedEmails = emails.map(email => email.toLowerCase().trim());
    
    this.validTestCodes.set(normalizedCode, normalizedEmails);
    
    const testCodeInfo: TestCodeInfo = {
      code: normalizedCode,
      emails: normalizedEmails,
      customerName,
      customerCompany,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      isActive: true,
      n8nWebhookUrl,
      n8nBotName,
      n8nBotGreeting
    };
    
    this.testCodeDetails.set(normalizedCode, testCodeInfo);
    this.testCodeUsageStats.set(normalizedCode, { logins: new Set() });
  }

  async deleteTestCode(code: string): Promise<void> {
    const normalizedCode = code.toUpperCase().trim();
    this.validTestCodes.delete(normalizedCode);
    this.testCodeDetails.delete(normalizedCode);
    this.testCodeUsageStats.delete(normalizedCode);
  }

  async getAllTestCodes(): Promise<TestCodeInfo[]> {
    const now = new Date();
    const codes = Array.from(this.testCodeDetails.values());
    
    // Update isActive status based on expiry
    return codes.map(code => ({
      ...code,
      isActive: code.expiresAt > now
    }));
  }

  async getTestCodeUsage(code: string): Promise<TestCodeUsage> {
    const normalizedCode = code.toUpperCase().trim();
    const stats = this.testCodeUsageStats.get(normalizedCode);
    
    if (!stats) {
      return {
        code: normalizedCode,
        totalLogins: 0,
        uniqueUsers: 0,
        activeSessions: 0
      };
    }

    const activeSessions = Array.from(this.testSessions.values())
      .filter(session => session.accessCode === normalizedCode && session.expiresAt > new Date())
      .length;

    return {
      code: normalizedCode,
      totalLogins: stats.logins.size,
      uniqueUsers: stats.logins.size,
      lastAccess: stats.lastAccess,
      activeSessions
    };
  }

  async getAllActiveSessions(): Promise<TestAccessGrant[]> {
    const now = new Date();
    return Array.from(this.testSessions.values())
      .filter(session => session.expiresAt > now);
  }

  private initializeTestCodes() {
    // Secure server-side test codes mapping
    const demoCode: TestCodeInfo = {
      code: 'ZKS-DEMO-2024',
      emails: ['demo@kunde.de', 'test@unternehmen.de'],
      customerName: 'Demo Kunde',
      customerCompany: 'Demo-Unternehmen',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true
    };

    this.validTestCodes.set('ZKS-DEMO-2024', demoCode.emails);
    this.testCodeDetails.set('ZKS-DEMO-2024', demoCode);
    this.testCodeUsageStats.set('ZKS-DEMO-2024', { logins: new Set() });
    
    this.validTestCodes.set('ZKS-TEST-2024', ['kunde@firma.de', 'user@company.de']);
    this.validTestCodes.set('ZKS-PREVIEW-2024', ['manager@startup.de', 'info@business.de']);
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
