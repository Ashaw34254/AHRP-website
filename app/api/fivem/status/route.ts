import { NextResponse } from "next/server";

export async function GET() {
  // Mock status - in production, this would query the actual FiveM server
  return NextResponse.json({
    connected: false,
    serverName: "Aurora Horizon RP",
    playerCount: 0,
    maxPlayers: 64,
    resources: 0,
    lastSync: null,
  });
}
