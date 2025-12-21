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
      subject,
      content,
      senderName,
      senderUnit,
      recipientName,
      recipientUnit,
      messageType,
    } = body;

    if (!subject || !content || !senderName || !messageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = await prisma.mDTMessage.create({
      data: {
        subject,
        content,
        senderName,
        senderUnit: senderUnit || null,
        recipientName: recipientName || null,
        recipientUnit: recipientUnit || null,
        messageType,
        isRead: false,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
