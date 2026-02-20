import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/reviews/:productId", async (req, res) => {
    const reviews = await storage.getReviewsByProductId(req.params.productId);
    res.json(reviews);
  });

  app.post("/api/reviews", async (req, res) => {
    const parsed = insertReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues.map(i => i.message).join(", ") });
    }
    const review = await storage.createReview(parsed.data);
    res.status(201).json(review);
  });

  return httpServer;
}
