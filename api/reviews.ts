import express from "express";
import { storage } from "../server/storage";
import { insertReviewSchema } from "../shared/schema";

const app = express();
app.use(express.json());

app.post("/api/reviews", async (req, res) => {
  const parsed = insertReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues.map((i) => i.message).join(", ") });
  }
  const review = await storage.createReview(parsed.data);
  return res.status(201).json(review);
});

export default app;
