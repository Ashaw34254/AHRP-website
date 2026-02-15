import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/cad/investigations/[id]/evidence - Add evidence to investigation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Generate evidence number
    const investigation = await prisma.investigation.findUnique({
      where: { id },
      select: { investigationId: true }
    });
    
    if (!investigation) {
      return NextResponse.json(
        { error: "Investigation not found" },
        { status: 404 }
      );
    }
    
    const evidenceCount = await prisma.investigationEvidence.count({
      where: { investigationId: id }
    });
    
    const evidenceNumber = `${investigation.investigationId}-EVD-${String(evidenceCount + 1).padStart(3, "0")}`;
    
    const evidence = await prisma.investigationEvidence.create({
      data: {
        investigationId: id,
        evidenceNumber,
        type: body.type,
        description: body.description,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileType: body.fileType,
        fileSize: body.fileSize,
        thumbnailUrl: body.thumbnailUrl,
        collectedAt: body.collectedAt ? new Date(body.collectedAt) : new Date(),
        collectedBy: body.collectedBy,
        location: body.location,
        custodyLog: body.custodyLog ? JSON.stringify(body.custodyLog) : JSON.stringify([{
          officer: body.collectedBy,
          action: "COLLECTED",
          timestamp: new Date().toISOString()
        }]),
        isSeized: body.isSeized || false,
        seizureAuthority: body.seizureAuthority,
        forensicNotes: body.forensicNotes,
        analysedBy: body.analysedBy,
        analysedAt: body.analysedAt ? new Date(body.analysedAt) : null,
        status: body.status || "PENDING",
        relevanceScore: body.relevanceScore || 5,
        tags: body.tags ? JSON.stringify(body.tags) : null
      }
    });
    
    // Update investigation last activity
    await prisma.investigation.update({
      where: { id },
      data: { lastActivityAt: new Date() }
    });
    
    // Create timeline entry
    await prisma.investigationTimeline.create({
      data: {
        investigationId: id,
        eventType: "EVIDENCE_ADDED",
        description: `Evidence added: ${body.type} - ${body.description}`,
        metadata: JSON.stringify({
          evidenceNumber,
          type: body.type
        }),
        performedBy: body.collectedBy
      }
    });
    
    return NextResponse.json({ evidence }, { status: 201 });
  } catch (error) {
    console.error("Failed to add evidence:", error);
    return NextResponse.json(
      { error: "Failed to add evidence" },
      { status: 500 }
    );
  }
}

// GET /api/cad/investigations/[id]/evidence - Get all evidence for investigation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeSuperseded = searchParams.get("includeSuperseded") === "true";
    
    const where: any = { investigationId: id };
    
    if (!includeSuperseded) {
      where.isSuperseded = false;
    }
    
    const evidence = await prisma.investigationEvidence.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    
    // Parse custody logs and tags
    const parsedEvidence = evidence.map((e: typeof evidence[number]) => ({
      ...e,
      custodyLog: e.custodyLog ? JSON.parse(e.custodyLog) : [],
      tags: e.tags ? JSON.parse(e.tags) : []
    }));
    
    return NextResponse.json({ evidence: parsedEvidence });
  } catch (error) {
    console.error("Failed to fetch evidence:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence" },
      { status: 500 }
    );
  }
}
