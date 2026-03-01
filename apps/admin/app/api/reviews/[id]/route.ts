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

  await storage.deleteReview(numericId);
  return new NextResponse(null, { status: 204 });
}
