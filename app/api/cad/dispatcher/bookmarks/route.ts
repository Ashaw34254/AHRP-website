import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const bookmarks = await prisma.messageBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// POST - Add bookmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, messageId } = body;

    if (!userId || !messageId) {
      return NextResponse.json(
        { error: "User ID and message ID required" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.messageBookmark.create({
      data: {
        userId,
        messageId,
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE - Remove bookmark
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    if (!userId || !messageId) {
      return NextResponse.json(
        { error: "User ID and message ID required" },
        { status: 400 }
      );
    }

    await prisma.messageBookmark.deleteMany({
      where: {
        userId,
        messageId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
