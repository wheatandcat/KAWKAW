import express from "express";
import { storage } from "../../server/storage";

const app = express();

app.get("/api/reviews/:productId", async (req, res) => {
  const reviews = await storage.getReviewsByProductId(req.params.productId);
  return res.json(reviews);
});

export default app;
