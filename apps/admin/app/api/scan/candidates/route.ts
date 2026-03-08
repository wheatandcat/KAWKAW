import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";

export async function GET() {
  const candidates = await storage.getScanCandidates();
  return NextResponse.json(candidates);
}

export async function DELETE(req: Request) {
  const body = await req.json() as { reviewIds?: number[] };
  const reviewIds = body.reviewIds;
  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    return NextResponse.json({ error: "reviewIdsは必須です" }, { status: 400 });
  }
  await storage.deleteScanCandidates(reviewIds);
  return new NextResponse(null, { status: 204 });
}
