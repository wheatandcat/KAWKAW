import express from "express";
import { storage } from "../server/storage";
import { insertReviewSchema } from "../shared/schema";
import { moderateText } from "../server/moderation";

const app = express();
app.use(express.json());

app.post("*", async (req, res) => {
  const parsed = insertReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues.map((i) => i.message).join(", ") });
  }

  const { flagged } = await moderateText(`${parsed.data.title} ${parsed.data.comment}`);
  if (flagged) {
    return res.status(400).json({ message: "不適切なコンテンツが含まれているため投稿できません" });
  }

  const review = await storage.createReview(parsed.data);
  return res.status(201).json(review);
});

export default app;
