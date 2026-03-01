import { createHash } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "パスワードが正しくありません" },
      { status: 401 }
    );
  }

  const token = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD)
    .digest("hex");

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7日
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_session");
  return res;
}
