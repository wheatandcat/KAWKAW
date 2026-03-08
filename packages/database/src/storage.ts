import {
  type User, type InsertUser, type Review, type InsertReview,
  type NgWord, type InsertNgWord, type ScanProgress, type ScanCandidate,
  users, reviews, ngWords, scanProgress, scanCandidates,
} from "./schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, or, ilike, count, gt, max, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getReviewsByProductId(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getAllReviews(search?: string, page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
  deleteReview(id: number): Promise<void>;
  // NGワード
  getNgWords(): Promise<NgWord[]>;
  addNgWord(word: InsertNgWord): Promise<NgWord>;
  deleteNgWord(id: number): Promise<void>;
  // スキャン進捗
  getScanProgress(): Promise<ScanProgress | undefined>;
  updateScanProgress(lastScannedId: number): Promise<void>;
  // スキャン候補
  getReviewsForScan(afterId: number): Promise<Review[]>;
  addScanCandidate(reviewId: number, spamScore: number, reasons: string[], aiChecked: boolean): Promise<void>;
  getScanCandidates(): Promise<(ScanCandidate & { review: Review })[]>;
  deleteScanCandidates(reviewIds: number[]): Promise<void>;
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

  async getNgWords(): Promise<NgWord[]> {
    return db.select().from(ngWords).orderBy(desc(ngWords.createdAt));
  }

  async addNgWord(word: InsertNgWord): Promise<NgWord> {
    const [created] = await db.insert(ngWords).values(word).returning();
    return created;
  }

  async deleteNgWord(id: number): Promise<void> {
    await db.delete(ngWords).where(eq(ngWords.id, id));
  }

  async getScanProgress(): Promise<ScanProgress | undefined> {
    const [row] = await db.select().from(scanProgress).where(eq(scanProgress.id, 1));
    return row;
  }

  async updateScanProgress(lastScannedId: number): Promise<void> {
    await db
      .insert(scanProgress)
      .values({ id: 1, lastScannedId, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: scanProgress.id,
        set: { lastScannedId, updatedAt: new Date() },
      });
  }

  async getReviewsForScan(afterId: number): Promise<Review[]> {
    return db.select().from(reviews).where(gt(reviews.id, afterId)).orderBy(reviews.id);
  }

  async addScanCandidate(reviewId: number, spamScore: number, reasons: string[], aiChecked: boolean): Promise<void> {
    await db.insert(scanCandidates).values({ reviewId, spamScore, reasons, aiChecked });
  }

  async getScanCandidates(): Promise<(ScanCandidate & { review: Review })[]> {
    const rows = await db
      .select()
      .from(scanCandidates)
      .innerJoin(reviews, eq(scanCandidates.reviewId, reviews.id))
      .orderBy(desc(reviews.id));
    return rows.map((r) => ({ ...r.scan_candidates, review: r.reviews }));
  }

  async deleteScanCandidates(reviewIds: number[]): Promise<void> {
    for (const reviewId of reviewIds) {
      await db.delete(reviews).where(eq(reviews.id, reviewId));
      // reviewのdeleteでON DELETE CASCADEによりscan_candidatesも削除される
    }
  }
}

export const storage = new DatabaseStorage();
