import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch read receipts for a message
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID required" },
        { status: 400 }
      );
    }

    const receipts = await prisma.messageReadReceipt.findMany({
      where: { messageId },
      orderBy: { readAt: "asc" },
    });

    return NextResponse.json({ receipts });
  } catch (error) {
    console.error("Error fetching read receipts:", error);
    return NextResponse.json(
      { error: "Failed to fetch read receipts" },
      { status: 500 }
    );
  }
}

// POST - Mark message as read and create receipt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, userId, userName } = body;

    if (!messageId || !userId || !userName) {
      return NextResponse.json(
        { error: "Message ID, user ID, and user name required" },
        { status: 400 }
      );
    }

    // Create or update read receipt
    const receipt = await prisma.messageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId,
        userId,
        userName,
      },
    });

    // Also mark the message as read
    await prisma.dispatcherMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    console.error("Error creating read receipt:", error);
    return NextResponse.json(
      { error: "Failed to create read receipt" },
      { status: 500 }
    );
  }
}
