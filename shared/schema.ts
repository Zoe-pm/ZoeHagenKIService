import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admin Session Types
export interface AdminSession {
  token: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

// Test Session Types  
export interface TestSession {
  token: string;
  email: string;
  expiresAt: string;
  createdAt: string;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

// Test Code Types
export interface TestCode {
  code: string;
  emails: string[];
  customerName?: string;
  customerCompany?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

export interface InsertTestCode {
  code: string;
  emails: string[];
  customerName?: string;
  customerCompany?: string;
  expiresInHours: number;
  sendEmail?: boolean;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}
