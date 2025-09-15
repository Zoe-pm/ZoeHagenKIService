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

// Test Configuration Types
export const testConfigSchema = z.object({
  activeBot: z.enum(["chatbot", "voicebot"]),
  chatbot: z.object({
    name: z.string(),
    primaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    textBackgroundColor: z.string(),
    widgetSize: z.enum(["small", "medium", "large"]),
    fontFamily: z.string(),
    position: z.enum(["bottom-right", "bottom-left", "center"]),
    greeting: z.string(),
    title: z.string(),
    subtitle: z.string(),
    inputPlaceholder: z.string(),
    messageToAlex: z.string(),
    logoUrl: z.string(),
    logoPosition: z.string(),
    logoSize: z.string(),
  }),
  voicebot: z.object({
    name: z.string(),
    primaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    textBackgroundColor: z.string(),
    widgetSize: z.enum(["small", "medium", "large"]),
    position: z.enum(["bottom-right", "bottom-left", "center"]),
    voiceSpeed: z.array(z.number()),
    voicePitch: z.array(z.number()),
    elevenLabsVoiceId: z.string(),
    elevenLabsVoiceName: z.string(),
    stability: z.number(),
    similarity: z.number(),
    speakerBoost: z.boolean(),
    greeting: z.string(),
    title: z.string(),
    subtitle: z.string(),
    inputPlaceholder: z.string(),
    messageToAlex: z.string(),
    logoUrl: z.string(),
    logoPosition: z.string(),
    logoSize: z.string(),
  }),
});

export const sendTestConfigSchema = z.object({
  testConfig: testConfigSchema,
  n8nWebhookUrl: z.string().optional(),
  n8nBotName: z.string().optional(),
  n8nBotGreeting: z.string().optional(),
});

export type TestConfig = z.infer<typeof testConfigSchema>;
export type SendTestConfigRequest = z.infer<typeof sendTestConfigSchema>;
