import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await params;
  revalidateTag(`reviews-${productId}`);
  return NextResponse.json({ revalidated: true });
}
