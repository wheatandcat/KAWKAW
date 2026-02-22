import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const reviews = await storage.getReviewsByProductId(productId);
  return NextResponse.json(reviews);
}
