import { NextResponse } from "next/server";

export async function POST() {
  // Mock sync - in production, this would trigger actual FiveM synchronization
  return NextResponse.json({
    success: true,
    message: "Sync initiated (stub implementation)",
    timestamp: new Date().toISOString(),
  });
}
