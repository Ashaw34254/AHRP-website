import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const messages = await prisma.mDTMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fromUnitId,
      fromCallsign,
      toUnitId,
      toCallsign,
      message: messageText,
      priority,
    } = body;

    if (!fromUnitId || !fromCallsign || !messageText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = await prisma.mDTMessage.create({
      data: {
        fromUnitId,
        fromCallsign,
        toUnitId: toUnitId || null,
        toCallsign: toCallsign || null,
        message: messageText,
        priority: priority || "NORMAL",
        isRead: false,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
