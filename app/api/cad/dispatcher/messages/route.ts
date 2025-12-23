import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "system";

    const messages = await prisma.dispatcherMessage.findMany({
      where: {
        OR: [
          { toUserId: userId }, // Direct messages to user
          { toUserId: null }, // Broadcast messages
          { fromUserId: userId }, // Messages sent by user
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching dispatcher messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fromUserId,
      fromName,
      fromCallsign,
      toUserId,
      message,
      priority,
      channel,
      category,
      mentions,
      parentId,
      threadId,
      expiresAt,
      department,
    } = body;

    if (!fromUserId || !fromName || !message) {
      return NextResponse.json(
        { error: "From user ID, name, and message are required" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.dispatcherMessage.create({
      data: {
        fromUserId,
        fromName,
        fromCallsign: fromCallsign || null,
        toUserId: toUserId || null,
        message,
        priority: priority || "NORMAL",
        channel: channel || "general",
        category: category || null,
        mentions: mentions && mentions.length > 0 ? JSON.stringify(mentions) : null,
        parentId: parentId || null,
        threadId: threadId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        department: department || null,
      },
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending dispatcher message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
