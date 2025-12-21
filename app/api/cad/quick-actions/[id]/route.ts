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
      actionType,
      hotkey,
      targetEndpoint,
      defaultPayload,
      buttonColor,
      icon,
      isActive,
      displayOrder,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (actionType !== undefined) updateData.actionType = actionType;
    if (hotkey !== undefined) updateData.hotkey = hotkey || null;
    if (targetEndpoint !== undefined) updateData.targetEndpoint = targetEndpoint || null;
    if (defaultPayload !== undefined) updateData.defaultPayload = defaultPayload || null;
    if (buttonColor !== undefined) updateData.buttonColor = buttonColor;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const action = await prisma.quickAction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ action });
  } catch (error) {
    console.error("Failed to update quick action:", error);
    return NextResponse.json({ error: "Failed to update quick action" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.quickAction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete quick action:", error);
    return NextResponse.json({ error: "Failed to delete quick action" }, { status: 500 });
  }
}
