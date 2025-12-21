import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const {
      status,
      narrative,
      approvedBy,
      suspects,
      victims,
      witnesses,
      evidence,
    } = body;

    const updateData: any = {};

    if (status) updateData.status = status;
    if (narrative !== undefined) updateData.narrative = narrative;
    if (approvedBy !== undefined) updateData.approvedBy = approvedBy;
    if (suspects !== undefined) updateData.suspects = suspects;
    if (victims !== undefined) updateData.victims = victims;
    if (witnesses !== undefined) updateData.witnesses = witnesses;
    if (evidence !== undefined) updateData.evidence = evidence;

    const report = await prisma.incidentReport.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      report: {
        id: report.id,
        reportNumber: report.reportNumber,
        title: report.title,
        reportedBy: report.reportedBy,
        occurredAt: report.occurredAt.toISOString(),
        location: report.location,
        type: report.type,
        status: report.status,
        narrative: report.narrative,
        suspects: report.suspects,
        victims: report.victims,
        witnesses: report.witnesses,
        evidence: report.evidence,
        approvedBy: report.approvedBy,
        callId: report.callId,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to update incident report:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.incidentReport.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete incident report:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
