import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      callType,
      priority,
      department,
      defaultLocation,
      defaultNotes,
      isActive,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (callType !== undefined) updateData.callType = callType;
    if (priority !== undefined) updateData.priority = priority;
    if (department !== undefined) updateData.department = department;
    if (defaultLocation !== undefined) updateData.defaultLocation = defaultLocation || null;
    if (defaultNotes !== undefined) updateData.defaultNotes = defaultNotes || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const template = await prisma.callTemplate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Failed to update template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.callTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
