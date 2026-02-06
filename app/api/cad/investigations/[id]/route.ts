import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/investigations/[id] - Get single investigation with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const investigation = await prisma.investigation.findUnique({
      where: { id },
      include: {
        timeline: {
          orderBy: { performedAt: "desc" }
        },
        evidence: {
          where: { isSuperseded: false },
          orderBy: { createdAt: "desc" }
        },
        notes: {
          orderBy: { createdAt: "desc" }
        },
        tasks: {
          orderBy: [
            { status: "asc" },
            { priority: "desc" },
            { dueDate: "asc" }
          ]
        }
      }
    });
    
    if (!investigation) {
      return NextResponse.json(
        { error: "Investigation not found" },
        { status: 404 }
      );
    }
    
    // Parse JSON fields
    const parsedInvestigation = {
      ...investigation,
      secondaryInvestigators: investigation.secondaryInvestigators 
        ? JSON.parse(investigation.secondaryInvestigators) 
        : [],
      linkedPersons: investigation.linkedPersons 
        ? JSON.parse(investigation.linkedPersons) 
        : [],
      linkedVehicles: investigation.linkedVehicles 
        ? JSON.parse(investigation.linkedVehicles) 
        : [],
      linkedLocations: investigation.linkedLocations 
        ? JSON.parse(investigation.linkedLocations) 
        : [],
      linkedIncidents: investigation.linkedIncidents 
        ? JSON.parse(investigation.linkedIncidents) 
        : [],
      linkedReports: investigation.linkedReports 
        ? JSON.parse(investigation.linkedReports) 
        : [],
      linkedCalls: investigation.linkedCalls 
        ? JSON.parse(investigation.linkedCalls) 
        : [],
      chargeRecommendations: investigation.chargeRecommendations 
        ? JSON.parse(investigation.chargeRecommendations) 
        : [],
      investigatorHistory: investigation.investigatorHistory 
        ? JSON.parse(investigation.investigatorHistory) 
        : []
    };
    
    return NextResponse.json({ investigation: parsedInvestigation });
  } catch (error) {
    console.error("Failed to fetch investigation:", error);
    return NextResponse.json(
      { error: "Failed to fetch investigation" },
      { status: 500 }
    );
  }
}

// PATCH /api/cad/investigations/[id] - Update investigation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData: any = {};
    const timelineEvents: any[] = [];
    
    // Track status changes for timeline
    if (body.status) {
      updateData.status = body.status;
      timelineEvents.push({
        eventType: "STATUS_CHANGE",
        description: `Status changed to ${body.status}`,
        metadata: JSON.stringify({ oldStatus: body.oldStatus, newStatus: body.status }),
        performedBy: body.updatedBy
      });
      
      if (body.status === "CLOSED" || body.status === "ARCHIVED") {
        updateData.closedAt = new Date();
      }
    }
    
    // Update basic fields
    if (body.title) updateData.title = body.title;
    if (body.classification) updateData.classification = body.classification;
    if (body.priority) updateData.priority = body.priority;
    if (body.summary) updateData.summary = body.summary;
    if (body.backgroundInfo !== undefined) updateData.backgroundInfo = body.backgroundInfo;
    if (body.handoverNotes !== undefined) updateData.handoverNotes = body.handoverNotes;
    if (body.prosecutionBrief !== undefined) updateData.prosecutionBrief = body.prosecutionBrief;
    if (body.evidenceSummary !== undefined) updateData.evidenceSummary = body.evidenceSummary;
    if (body.securityLevel) updateData.securityLevel = body.securityLevel;
    if (body.assignedTeam) updateData.assignedTeam = body.assignedTeam;
    if (body.courtCaseId !== undefined) updateData.courtCaseId = body.courtCaseId;
    
    // Update investigators
    if (body.primaryInvestigator) {
      updateData.primaryInvestigator = body.primaryInvestigator;
      timelineEvents.push({
        eventType: "HANDOVER",
        description: `Primary investigator changed to ${body.primaryInvestigator}`,
        performedBy: body.updatedBy
      });
    }
    
    if (body.secondaryInvestigators) {
      updateData.secondaryInvestigators = JSON.stringify(body.secondaryInvestigators);
    }
    
    // Update linked entities
    if (body.linkedPersons) updateData.linkedPersons = JSON.stringify(body.linkedPersons);
    if (body.linkedVehicles) updateData.linkedVehicles = JSON.stringify(body.linkedVehicles);
    if (body.linkedLocations) updateData.linkedLocations = JSON.stringify(body.linkedLocations);
    if (body.linkedIncidents) updateData.linkedIncidents = JSON.stringify(body.linkedIncidents);
    if (body.linkedReports) updateData.linkedReports = JSON.stringify(body.linkedReports);
    if (body.linkedCalls) updateData.linkedCalls = JSON.stringify(body.linkedCalls);
    
    // Update charge recommendations
    if (body.chargeRecommendations) {
      updateData.chargeRecommendations = JSON.stringify(body.chargeRecommendations);
    }
    
    // Update investigator history
    if (body.addToInvestigatorHistory) {
      const existing = await prisma.investigation.findUnique({
        where: { id },
        select: { investigatorHistory: true }
      });
      
      const history = existing?.investigatorHistory 
        ? JSON.parse(existing.investigatorHistory) 
        : [];
      
      history.push(body.addToInvestigatorHistory);
      updateData.investigatorHistory = JSON.stringify(history);
    }
    
    // Always update last activity timestamp
    updateData.lastActivityAt = new Date();
    
    // Update investigation
    const investigation = await prisma.investigation.update({
      where: { id },
      data: updateData,
      include: {
        timeline: {
          take: 10,
          orderBy: { performedAt: "desc" }
        },
        evidence: {
          where: { isSuperseded: false },
          take: 10
        },
        notes: {
          take: 5,
          orderBy: { createdAt: "desc" }
        },
        tasks: {
          where: { status: { not: "COMPLETED" } }
        }
      }
    });
    
    // Create timeline entries
    for (const event of timelineEvents) {
      await prisma.investigationTimeline.create({
        data: {
          investigationId: id,
          ...event
        }
      });
    }
    
    return NextResponse.json({ investigation });
  } catch (error) {
    console.error("Failed to update investigation:", error);
    return NextResponse.json(
      { error: "Failed to update investigation" },
      { status: 500 }
    );
  }
}

// DELETE /api/cad/investigations/[id] - Archive investigation (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const archivedBy = searchParams.get("archivedBy") || "System";
    
    const investigation = await prisma.investigation.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        closedAt: new Date(),
        lastActivityAt: new Date()
      }
    });
    
    // Create timeline entry
    await prisma.investigationTimeline.create({
      data: {
        investigationId: id,
        eventType: "STATUS_CHANGE",
        description: "Investigation archived",
        performedBy: archivedBy
      }
    });
    
    return NextResponse.json({ success: true, investigation });
  } catch (error) {
    console.error("Failed to archive investigation:", error);
    return NextResponse.json(
      { error: "Failed to archive investigation" },
      { status: 500 }
    );
  }
}
