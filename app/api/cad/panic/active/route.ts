import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/panic/active - Get only active panic alerts
export async function GET() {
  try {
    const alerts = await prisma.panicAlert.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error("Error fetching active panic alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch active panic alerts" },
      { status: 500 }
    );
  }
}
