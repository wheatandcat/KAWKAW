import { type Review, type InsertReview, reviews } from "../../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export const storage = {
  async getReviewsByProductId(productId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  },
  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  },
};
