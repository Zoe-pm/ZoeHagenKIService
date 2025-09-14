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
    return this.testSessions.get(token);
  }

  async deleteTestSession(token: string): Promise<void> {
    this.testSessions.delete(token);
  }

  // Test Code Management
  async createTestCode(insertTestCode: InsertTestCode): Promise<TestCode> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + insertTestCode.expiresInHours * 60 * 60 * 1000);
    
    const testCode: TestCode = {
      code: insertTestCode.code,
      emails: insertTestCode.emails,
      customerName: insertTestCode.customerName,
      customerCompany: insertTestCode.customerCompany,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true,
      n8nWebhookUrl: insertTestCode.n8nWebhookUrl,
      n8nBotName: insertTestCode.n8nBotName,
      n8nBotGreeting: insertTestCode.n8nBotGreeting
    };
    
    this.testCodes.set(insertTestCode.code, testCode);
    return testCode;
  }

  async getTestCode(code: string): Promise<TestCode | undefined> {
    const testCode = this.testCodes.get(code);
    if (testCode && new Date(testCode.expiresAt) < new Date()) {
      testCode.isActive = false;
    }
    return testCode;
  }

  async getAllTestCodes(): Promise<TestCode[]> {
    const codes = Array.from(this.testCodes.values());
    // Update active status
    codes.forEach(code => {
      if (new Date(code.expiresAt) < new Date()) {
        code.isActive = false;
      }
    });
    return codes;
  }

  async deleteTestCode(code: string): Promise<void> {
    this.testCodes.delete(code);
  }

  async getTestCodeByEmail(email: string, code: string): Promise<TestCode | undefined> {
    const testCode = this.testCodes.get(code);
    if (testCode && testCode.emails.includes(email)) {
      if (new Date(testCode.expiresAt) < new Date()) {
        testCode.isActive = false;
      }
      return testCode;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
