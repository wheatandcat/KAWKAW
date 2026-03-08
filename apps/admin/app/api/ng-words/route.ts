import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";

export async function GET() {
  const words = await storage.getNgWords();
  return NextResponse.json(words);
}

export async function POST(req: Request) {
  const body = await req.json() as { word?: string };
  const word = body.word?.trim();
  if (!word) {
    return NextResponse.json({ error: "wordは必須です" }, { status: 400 });
  }
  try {
    const created = await storage.addNgWord({ word });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "すでに登録済みのワードです" }, { status: 409 });
  }
}
