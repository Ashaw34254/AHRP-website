import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/messages - Get user's messages
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id!;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: userId },
          { senderId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { receiverId, subject, content, type } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: "Receiver and content are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id!,
        receiverId,
        subject: subject || null,
        content,
        type: type || "DIRECT",
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/messages - Mark message as read
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
    const { messageId, isRead } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      );
    }

    // Verify user is receiver
    const existing = await prisma.message.findUnique({
      where: { id: messageId },
      select: { receiverId: true },
    });

    if (!existing || existing.receiverId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Message not found or access denied" },
        { status: 404 }
      );
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: isRead ?? true },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/messages - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Message ID is required" },
        { status: 400 }
      );
    }

    // Verify user is sender or receiver
    const existing = await prisma.message.findUnique({
      where: { id: messageId },
      select: { senderId: true, receiverId: true },
    });

    if (!existing || (existing.senderId !== session.user.id && existing.receiverId !== session.user.id)) {
      return NextResponse.json(
        { success: false, message: "Message not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
