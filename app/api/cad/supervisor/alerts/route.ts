import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const alerts = await prisma.supervisorAlert.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, alertType, priority, requiresApproval } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const alert = await prisma.supervisorAlert.create({
      data: {
        title,
        message,
        alertType: alertType || "GENERAL",
        priority: priority || "MEDIUM",
        requiresApproval: requiresApproval || false,
        createdBy: "SYSTEM", // Replace with actual user from session
        isDismissed: false,
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
