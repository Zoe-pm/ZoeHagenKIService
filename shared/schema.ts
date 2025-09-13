import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, decimal, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  interest: text("interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  preferredTime: text("preferred_time"),
  productInterest: text("product_interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  features: jsonb("features").notNull(),
  implementationTime: text("implementation_time").notNull(),
  targetAudience: text("target_audience").notNull(),
  useCases: jsonb("use_cases").notNull(),
  integrations: jsonb("integrations").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Test access schemas
export const testAccessSchema = z.object({
  email: z.string().email("Ungültige Email-Adresse"),
  accessCode: z.string().min(1, "Zugriffscode ist erforderlich"),
});

export const testSessionSchema = z.object({
  token: z.string(),
});

export type TestAccessRequest = z.infer<typeof testAccessSchema>;
export type TestSession = z.infer<typeof testSessionSchema>;

// Test accounts and sessions tables
export const testAccounts = pgTable("test_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  testCode: text("test_code").notNull().unique(),
  customerName: text("customer_name"),
  customerCompany: text("customer_company"),
  isActive: text("is_active").notNull().default("true"), // "true" | "false"
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testAccountId: varchar("test_account_id").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Voice preferences for ElevenLabs integration - test environment only
export const voicePreferences = pgTable("voice_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull(),
  email: text("email").notNull(),
  elevenLabsVoiceId: text("elevenlabs_voice_id").notNull(),
  stability: decimal("stability", { precision: 3, scale: 2 }).notNull().default("0.50"), // 0.00 - 1.00
  similarity: decimal("similarity", { precision: 3, scale: 2 }).notNull().default("0.75"), // 0.00 - 1.00  
  speakerBoost: boolean("speaker_boost").notNull().default(false),
  speed: decimal("speed", { precision: 3, scale: 2 }).notNull().default("1.00"), // 0.70 - 1.20
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Unique constraint on sessionToken + email to prevent duplicates
  sessionEmailUniqueIdx: uniqueIndex("voice_pref_session_email_uq").on(table.sessionToken, table.email),
}));

export const insertTestAccountSchema = createInsertSchema(testAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertTestSessionSchema = createInsertSchema(testSessions).omit({
  id: true,
  createdAt: true,
});

export const insertVoicePreferencesSchema = createInsertSchema(voicePreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestAccount = z.infer<typeof insertTestAccountSchema>;
export type TestAccount = typeof testAccounts.$inferSelect;
export type InsertTestSession = z.infer<typeof insertTestSessionSchema>;
export type TestSessionDb = typeof testSessions.$inferSelect;
export type InsertVoicePreferences = z.infer<typeof insertVoicePreferencesSchema>;
export type VoicePreferences = typeof voicePreferences.$inferSelect;

export interface TestAccessGrant {
  id: string;
  email: string;
  accessCode: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

export interface TestCodeInfo {
  code: string;
  emails: string[];
  customerName?: string;
  customerCompany?: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

export interface TestCodeUsage {
  code: string;
  totalLogins: number;
  uniqueUsers: number;
  lastAccess?: Date;
  activeSessions: number;
}

// Test config save schema  
export const testConfigSaveSchema = z.object({
  email: z.string().email(),
  sessionToken: z.string(),
  config: z.object({
    activeBot: z.enum(["chatbot", "voicebot"]),
    chatbot: z.object({
      name: z.string(),
      primaryColor: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
      widgetSize: z.string(),
      fontFamily: z.string(),
      position: z.string(),
      greeting: z.string(),
      title: z.string(),
      subtitle: z.string(),
      logoUrl: z.string(),
      logoPosition: z.string(),
      logoSize: z.string(),
    }),
    voicebot: z.object({
      name: z.string(),
      primaryColor: z.string(),
      backgroundColor: z.string(),
      widgetSize: z.string(),
      position: z.string(),
      voiceSpeed: z.array(z.number()),
      voicePitch: z.array(z.number()),
      elevenLabsVoiceId: z.string(),
      greeting: z.string(),
      title: z.string(),
      subtitle: z.string(),
      logoUrl: z.string(),
      logoPosition: z.string(),
      logoSize: z.string(),
    })
  })
});

export type TestConfigSave = z.infer<typeof testConfigSaveSchema>;

// Voice Preferences API Schemas
export const voicePreferencesApiSchema = z.object({
  sessionToken: z.string().min(1, "Session token erforderlich"),
  email: z.string().email("Ungültige Email-Adresse"), 
  elevenLabsVoiceId: z.string().min(1, "Voice ID erforderlich"),
  stability: z.number().min(0).max(1).default(0.5),
  similarity: z.number().min(0).max(1).default(0.75),
  speakerBoost: z.boolean().default(false),
  speed: z.number().min(0.7).max(1.2).default(1.0),
});

export const voicePreferencesResponseSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  email: z.string(),
  elevenLabsVoiceId: z.string(),
  stability: z.string(), // decimal as string from database
  similarity: z.string(),
  speakerBoost: z.boolean(),
  speed: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type VoicePreferencesApi = z.infer<typeof voicePreferencesApiSchema>;
export type VoicePreferencesResponse = z.infer<typeof voicePreferencesResponseSchema>;
