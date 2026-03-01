import { NextResponse } from "next/server";
import { storage, insertReviewSchema } from "@kawkaw/database";
import { moderateText } from "@/server/moderation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = insertReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    );
  }

  const { flagged } = await moderateText(
    `${parsed.data.title} ${parsed.data.comment}`
  );
  if (flagged) {
    return NextResponse.json(
      { message: "不適切なコンテンツが含まれているため投稿できません" },
      { status: 400 }
    );
  }

  const review = await storage.createReview(parsed.data);
  return NextResponse.json(review, { status: 201 });
}
