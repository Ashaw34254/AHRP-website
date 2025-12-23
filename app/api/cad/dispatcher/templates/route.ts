import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const department = searchParams.get("department");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const where: any = {
      OR: [
        { userId }, // User's own templates
        { isPublic: true, department }, // Public department templates
      ],
    };

    const templates = await prisma.messageTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST - Create template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, text, category, department, isPublic } = body;

    if (!userId || !name || !text) {
      return NextResponse.json(
        { error: "User ID, name, and text required" },
        { status: 400 }
      );
    }

    const template = await prisma.messageTemplate.create({
      data: {
        userId,
        name,
        text,
        category: category || null,
        department: department || null,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}

// DELETE - Remove template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!templateId || !userId) {
      return NextResponse.json(
        { error: "Template ID and user ID required" },
        { status: 400 }
      );
    }

    // Only allow deleting own templates
    await prisma.messageTemplate.deleteMany({
      where: {
        id: templateId,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
