import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ログインページと認証APIはスキップ
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // セッショントークンを検証 (SHA-256(ADMIN_PASSWORD) と比較)
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  const expected = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (session !== expected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
