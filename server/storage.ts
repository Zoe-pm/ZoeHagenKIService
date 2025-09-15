import { type User, type InsertUser, type AdminSession, type TestSession, type TestCode, type InsertTestCode } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin Session Management
  createAdminSession(token: string, email: string, expiresAt: string): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<void>;
  
  // Test Session Management
  createTestSession(token: string, email: string, expiresAt: string, n8nConfig?: { webhookUrl?: string; botName?: string; botGreeting?: string }): Promise<TestSession>;
  getTestSession(token: string): Promise<TestSession | undefined>;
  deleteTestSession(token: string): Promise<void>;
  
  // Test Code Management
  createTestCode(testCode: InsertTestCode): Promise<TestCode>;
  getTestCode(code: string): Promise<TestCode | undefined>;
  getAllTestCodes(): Promise<TestCode[]>;
  deleteTestCode(code: string): Promise<void>;
  getTestCodeByEmail(email: string, code: string): Promise<TestCode | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminSessions: Map<string, AdminSession>;
  private testSessions: Map<string, TestSession>;
  private testCodes: Map<string, TestCode>;

  constructor() {
    this.users = new Map();
    this.adminSessions = new Map();
    this.testSessions = new Map();
    this.testCodes = new Map();
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

  // Admin Session Management
  async createAdminSession(token: string, email: string, expiresAt: string): Promise<AdminSession> {
    const session: AdminSession = {
      token,
      email,
      expiresAt,
      createdAt: new Date().toISOString()
    };
    this.adminSessions.set(token, session);
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    return this.adminSessions.get(token);
  }

  async deleteAdminSession(token: string): Promise<void> {
    this.adminSessions.delete(token);
  }

  // Test Session Management
  async createTestSession(token: string, email: string, expiresAt: string, n8nConfig?: { webhookUrl?: string; botName?: string; botGreeting?: string }): Promise<TestSession> {
    const session: TestSession = {
      token,
      email,
      expiresAt,
      createdAt: new Date().toISOString(),
      n8nWebhookUrl: n8nConfig?.webhookUrl,
      n8nBotName: n8nConfig?.botName,
      n8nBotGreeting: n8nConfig?.botGreeting
    };
    this.testSessions.set(token, session);
    return session;
  }

  async getTestSession(token: string): Promise<TestSession | undefined> {
    const session = this.testSessions.get(token);
    if (!session) {
      return undefined;
    }
    
    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      // Delete expired session
      this.testSessions.delete(token);
      return undefined;
    }
    
    return session;
  }

  async deleteTestSession(token: string): Promise<void> {
    this.testSessions.delete(token);
  }

  // Test Code Management
  async createTestCode(insertTestCode: InsertTestCode): Promise<TestCode> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + insertTestCode.expiresInHours * 60 * 60 * 1000);
    
    const normalizedCode = insertTestCode.code.trim().toUpperCase();
    const normalizedEmails = insertTestCode.emails.map(email => email.trim().toLowerCase());
    
    const testCode: TestCode = {
      code: normalizedCode,
      emails: normalizedEmails,
      customerName: insertTestCode.customerName,
      customerCompany: insertTestCode.customerCompany,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true,
      n8nWebhookUrl: insertTestCode.n8nWebhookUrl,
      n8nBotName: insertTestCode.n8nBotName,
      n8nBotGreeting: insertTestCode.n8nBotGreeting
    };
    
    this.testCodes.set(normalizedCode, testCode);
    return testCode;
  }

  async getTestCode(code: string): Promise<TestCode | undefined> {
    const normalizedCode = code.trim().toUpperCase();
    const testCode = this.testCodes.get(normalizedCode);
    if (testCode && new Date(testCode.expiresAt) < new Date()) {
      // Delete expired code instead of just marking it inactive
      this.testCodes.delete(normalizedCode);
      return undefined;
    }
    return testCode;
  }

  async getAllTestCodes(): Promise<TestCode[]> {
    const codes = Array.from(this.testCodes.values());
    const validCodes: TestCode[] = [];
    
    // Clean up expired codes and return only valid ones
    codes.forEach(code => {
      if (new Date(code.expiresAt) < new Date()) {
        // Delete expired code
        this.testCodes.delete(code.code);
      } else {
        validCodes.push(code);
      }
    });
    
    return validCodes;
  }

  async deleteTestCode(code: string): Promise<void> {
    const normalizedCode = code.trim().toUpperCase();
    // Get the test code before deleting to know which emails were associated
    const testCode = this.testCodes.get(normalizedCode);
    
    // Delete the test code
    this.testCodes.delete(normalizedCode);
    
    // If the code existed and had associated emails, delete sessions for those emails
    if (testCode && testCode.emails && testCode.emails.length > 0) {
      const sessionsToDelete: string[] = [];
      
      this.testSessions.forEach((session, token) => {
        // Delete sessions whose email was in the deleted test code
        if (testCode.emails.includes(session.email)) {
          sessionsToDelete.push(token);
        }
      });
      
      // Actually delete the sessions
      sessionsToDelete.forEach(token => {
        this.testSessions.delete(token);
      });
      
      console.log(`Deleted ${sessionsToDelete.length} sessions for test code: ${normalizedCode}`);
    }
  }

  async getTestCodeByEmail(email: string, code: string): Promise<TestCode | undefined> {
    const normalizedCode = code.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();
    const testCode = this.testCodes.get(normalizedCode);
    if (testCode && testCode.emails.includes(normalizedEmail)) {
      if (new Date(testCode.expiresAt) < new Date()) {
        // Delete expired code instead of just marking it inactive
        this.testCodes.delete(normalizedCode);
        return undefined;
      }
      return testCode;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
