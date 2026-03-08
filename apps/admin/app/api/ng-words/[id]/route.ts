import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await storage.deleteNgWord(numId);
  return new NextResponse(null, { status: 204 });
}
