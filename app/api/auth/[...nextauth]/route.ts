import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";

// In development mode, return mock session data to prevent Auth.js errors
const isDev = process.env.NODE_ENV === "development";

const mockSession = {
  user: {
    id: "dev-user-1",
    name: "Dev User",
    email: "dev@ahrp.local",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser",
    role: "admin",
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export async function GET(request: NextRequest) {
  if (isDev) {
    const url = new URL(request.url);
    
    // Handle session endpoint
    if (url.pathname.includes("/session")) {
      return NextResponse.json(mockSession);
    }
    
    // Handle other endpoints
    return NextResponse.json({ error: "Dev mode active" }, { status: 200 });
  }
  
  // Production mode - use real Auth.js handlers
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (isDev) {
    return NextResponse.json({ error: "Dev mode active" }, { status: 200 });
  }
  
  // Production mode - use real Auth.js handlers
  return handlers.POST(request);
}
