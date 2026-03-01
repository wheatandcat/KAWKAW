import { type User, type InsertUser, type Review, type InsertReview, users, reviews } from "./schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, or, ilike, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getReviewsByProductId(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getAllReviews(search?: string, page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
  deleteReview(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getReviewsByProductId(productId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async getAllReviews(search?: string, page = 1, limit = 100): Promise<{ reviews: Review[]; total: number }> {
    const where = search?.trim()
      ? or(
          ilike(reviews.nickname, `%${search}%`),
          ilike(reviews.title, `%${search}%`),
          ilike(reviews.comment, `%${search}%`)
        )
      : undefined;

    const [{ total }] = await db.select({ total: count() }).from(reviews).where(where);
    const items = await db
      .select()
      .from(reviews)
      .where(where)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return { reviews: items, total };
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}

export const storage = new DatabaseStorage();
