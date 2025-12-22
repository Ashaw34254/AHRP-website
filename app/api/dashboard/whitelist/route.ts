import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/whitelist - Get user's whitelist status
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const whitelist = await prisma.whitelistEntry.findUnique({
      where: { userId: session.user.id! },
    });

    return NextResponse.json({
      success: true,
      whitelist,
    });
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/whitelist - Update Steam ID
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { steamId } = body;

    if (!steamId) {
      return NextResponse.json(
        { success: false, message: "Steam ID is required" },
        { status: 400 }
      );
    }

    // Validate Steam ID format (basic check)
    if (!/^\d{17}$/.test(steamId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Steam ID format (must be 17 digits)" },
        { status: 400 }
      );
    }

    const whitelist = await prisma.whitelistEntry.upsert({
      where: { userId: session.user.id! },
      create: {
        userId: session.user.id!,
        steamId,
        status: "PENDING", // Admin must approve
      },
      update: {
        steamId,
      },
    });

    return NextResponse.json({
      success: true,
      whitelist,
    });
  } catch (error) {
    console.error("Error updating whitelist:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
