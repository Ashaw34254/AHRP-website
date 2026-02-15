import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.callTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      callType,
      priority,
      department,
      descriptionTemplate,
      isPublic,
      createdById,
    } = body;

    if (!name || !callType || !description || !descriptionTemplate || !createdById) {
      return NextResponse.json({ error: "Name, description, callType, descriptionTemplate, and createdById are required" }, { status: 400 });
    }

    const template = await prisma.callTemplate.create({
      data: {
        name,
        description,
        callType,
        priority: priority || "MEDIUM",
        department: department || "POLICE",
        descriptionTemplate,
        isPublic: isPublic || false,
        createdById,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
