import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/cad/investigations/evidence/[evidenceId] - Update evidence
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ evidenceId: string }> }
) {
  try {
    const { evidenceId } = await params;
    const body = await request.json();
    const updateData: any = {};
    
    // Update basic fields
    if (body.type) updateData.type = body.type;
    if (body.description) updateData.description = body.description;
    if (body.status) updateData.status = body.status;
    if (body.forensicNotes !== undefined) updateData.forensicNotes = body.forensicNotes;
    if (body.analysedBy) updateData.analysedBy = body.analysedBy;
    if (body.analysedAt) updateData.analysedAt = new Date(body.analysedAt);
    if (body.relevanceScore) updateData.relevanceScore = body.relevanceScore;
    if (body.tags) updateData.tags = JSON.stringify(body.tags);
    
    // Handle custody log update
    if (body.addToCustodyLog) {
      const existing = await prisma.investigationEvidence.findUnique({
        where: { id: evidenceId },
        select: { custodyLog: true }
      });
      
      const custodyLog = existing?.custodyLog ? JSON.parse(existing.custodyLog) : [];
      custodyLog.push({
        ...body.addToCustodyLog,
        timestamp: new Date().toISOString()
      });
      
      updateData.custodyLog = JSON.stringify(custodyLog);
    }
    
    // Handle superseding evidence
    if (body.supersede) {
      updateData.isSuperseded = true;
      updateData.supersededBy = body.supersededBy;
      updateData.supersededReason = body.supersededReason;
      updateData.status = "SUPERSEDED";
    }
    
    const evidence = await prisma.investigationEvidence.update({
      where: { id: evidenceId },
      data: updateData
    });
    
    return NextResponse.json({ evidence });
  } catch (error) {
    console.error("Failed to update evidence:", error);
    return NextResponse.json(
      { error: "Failed to update evidence" },
      { status: 500 }
    );
  }
}

// DELETE /api/cad/investigations/evidence/[evidenceId] - Mark evidence as superseded (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ evidenceId: string }> }
) {
  try {
    const { evidenceId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const reason = searchParams.get("reason") || "Removed by investigator";
    
    const evidence = await prisma.investigationEvidence.update({
      where: { id: evidenceId },
      data: {
        isSuperseded: true,
        supersededReason: reason,
        status: "SUPERSEDED"
      }
    });
    
    return NextResponse.json({ success: true, evidence });
  } catch (error) {
    console.error("Failed to supersede evidence:", error);
    return NextResponse.json(
      { error: "Failed to supersede evidence" },
      { status: 500 }
    );
  }
}
