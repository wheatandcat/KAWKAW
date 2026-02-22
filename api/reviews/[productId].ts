import express from "express";
import { storage } from "../_lib/storage";

const app = express();

app.get("*", async (req, res) => {
  const productId = req.query.productId as string;
  const reviews = await storage.getReviewsByProductId(productId);
  return res.json(reviews);
});

export default app;
