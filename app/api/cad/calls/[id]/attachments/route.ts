import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch attachments for a call
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachments = await prisma.callAttachment.findMany({
      where: { callId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error("Error fetching call attachments:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    );
  }
}

// POST - Add attachment to call
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fileName, fileUrl, fileType, description, uploadedBy } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { error: "File name and URL are required" },
        { status: 400 }
      );
    }

    const attachment = await prisma.callAttachment.create({
      data: {
        callId: id,
        filename: fileName,
        url: fileUrl,
        type: fileType || "document",
      },
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    console.error("Error creating call attachment:", error);
    return NextResponse.json(
      { error: "Failed to create attachment" },
      { status: 500 }
    );
  }
}
