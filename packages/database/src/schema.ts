import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial, boolean } from "drizzle-orm/pg-core";
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

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  nickname: text("nickname").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  nickname: z.string().min(1).max(30),
  title: z.string().min(1).max(100),
  comment: z.string().min(1).max(1000),
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const ngWords = pgTable("ng_words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNgWordSchema = createInsertSchema(ngWords).pick({ word: true });
export type InsertNgWord = z.infer<typeof insertNgWordSchema>;
export type NgWord = typeof ngWords.$inferSelect;

export const scanProgress = pgTable("scan_progress", {
  id: integer("id").primaryKey().default(1),
  lastScannedId: integer("last_scanned_id").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScanProgress = typeof scanProgress.$inferSelect;

export const scanCandidates = pgTable("scan_candidates", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  spamScore: integer("spam_score").notNull(),
  reasons: text("reasons").array().notNull(),
  aiChecked: boolean("ai_checked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ScanCandidate = typeof scanCandidates.$inferSelect;
