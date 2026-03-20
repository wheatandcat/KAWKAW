import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { storage } from "@kawkaw/database";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const getCachedReviews = unstable_cache(
    () => storage.getReviewsByProductId(productId),
    [`reviews-${productId}`],
    { tags: [`reviews-${productId}`] }
  );
  const reviews = await getCachedReviews();
  return NextResponse.json(reviews);
}
