import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip auth in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // In production, use Auth.js middleware
  const { auth } = await import("@/auth");
  return auth(request as any);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
