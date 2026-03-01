import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";

const LIMIT = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const result = await storage.getAllReviews(search, page, LIMIT);
  return NextResponse.json({ ...result, page, limit: LIMIT });
}
