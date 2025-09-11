import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
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

export interface TestAccessGrant {
  id: string;
  email: string;
  accessCode: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}
