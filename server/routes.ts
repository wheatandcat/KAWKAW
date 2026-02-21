import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";
import { generateOgImage } from "./og-image";
import { getProductById } from "./product-data";

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

  const ogCache = new Map<string, { png: Buffer; ts: number }>();
  const OG_CACHE_TTL = 1000 * 60 * 60;

  app.get("/api/og/:productId", async (req, res) => {
    try {
      const { productId } = req.params;

      const cached = ogCache.get(productId);
      if (cached && Date.now() - cached.ts < OG_CACHE_TTL) {
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.send(cached.png);
      }

      const product = await getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const png = await generateOgImage(product);
      ogCache.set(productId, { png, ts: Date.now() });

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.send(png);
    } catch (error) {
      console.error("OG image generation error:", error);
      return res.status(500).json({ message: "Failed to generate image" });
    }
  });

  return httpServer;
}
