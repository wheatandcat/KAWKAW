import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const deleted = await storage.deleteReview(numericId);

  if (deleted && process.env.PUBLIC_APP_URL && process.env.REVALIDATE_SECRET) {
    await fetch(
      `${process.env.PUBLIC_APP_URL}/api/revalidate/reviews/${deleted.productId}`,
      {
        method: "POST",
        headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET },
      }
    );
  }

  return new NextResponse(null, { status: 204 });
}
