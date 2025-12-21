import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      verdict,
      sentence,
      hearingDate,
      notes,
    } = body;

    const updateData: any = {};

    if (status) updateData.status = status;
    if (verdict) updateData.verdict = verdict;
    if (sentence !== undefined) updateData.sentence = sentence;
    if (hearingDate !== undefined) updateData.hearingDate = hearingDate ? new Date(hearingDate) : null;
    if (notes !== undefined) updateData.notes = notes;

    const courtCase = await prisma.courtCase.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ case: courtCase });
  } catch (error) {
    console.error("Failed to update court case:", error);
    return NextResponse.json({ error: "Failed to update court case" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.courtCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete court case:", error);
    return NextResponse.json({ error: "Failed to delete court case" }, { status: 500 });
  }
}
