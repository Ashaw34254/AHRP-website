import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/investigations - List investigations with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Query parameters
    const status = searchParams.get("status")?.split(",").filter(Boolean);
    const classification = searchParams.get("classification");
    const priority = searchParams.get("priority");
    const investigator = searchParams.get("investigator");
    const assignedTeam = searchParams.get("assignedTeam");
    const securityLevel = searchParams.get("securityLevel");
    const search = searchParams.get("search");
    const days = searchParams.get("days");
    
    // Build where clause
    const where: any = {};
    
    if (status && status.length > 0) {
      where.status = { in: status };
    }
    
    if (classification) {
      where.classification = classification;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (investigator) {
      where.OR = [
        { primaryInvestigator: { contains: investigator } },
        { secondaryInvestigators: { contains: investigator } }
      ];
    }
    
    if (assignedTeam) {
      where.assignedTeam = assignedTeam;
    }
    
    if (securityLevel) {
      where.securityLevel = securityLevel;
    }
    
    if (search) {
      where.OR = [
        { investigationId: { contains: search } },
        { title: { contains: search } },
        { summary: { contains: search } }
      ];
    }
    
    // Date range filter
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.lastActivityAt = { gte: daysAgo };
    }
    
    const investigations = await prisma.investigation.findMany({
      where,
      include: {
        timeline: {
          take: 5,
          orderBy: { performedAt: "desc" }
        },
        evidence: {
          where: { status: { not: "SUPERSEDED" } },
          take: 10
        },
        notes: {
          take: 5,
          orderBy: { createdAt: "desc" }
        },
        tasks: {
          where: { status: { not: "COMPLETED" } }
        }
      },
      orderBy: [
        { priority: "desc" },
        { lastActivityAt: "desc" }
      ]
    });
    
    return NextResponse.json({ investigations });
  } catch (error) {
    console.error("Failed to fetch investigations:", error);
    return NextResponse.json(
      { error: "Failed to fetch investigations" },
      { status: 500 }
    );
  }
}

// POST /api/cad/investigations - Create new investigation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate investigation ID
    const year = new Date().getFullYear();
    const count = await prisma.investigation.count();
    const investigationId = `INV-${year}-${String(count + 1).padStart(6, "0")}`;
    
    const investigation = await prisma.investigation.create({
      data: {
        investigationId,
        title: body.title,
        classification: body.classification,
        status: body.status || "ACTIVE",
        priority: body.priority || "MEDIUM",
        primaryInvestigator: body.primaryInvestigator,
        secondaryInvestigators: body.secondaryInvestigators ? JSON.stringify(body.secondaryInvestigators) : null,
        summary: body.summary,
        backgroundInfo: body.backgroundInfo,
        linkedPersons: body.linkedPersons ? JSON.stringify(body.linkedPersons) : null,
        linkedVehicles: body.linkedVehicles ? JSON.stringify(body.linkedVehicles) : null,
        linkedLocations: body.linkedLocations ? JSON.stringify(body.linkedLocations) : null,
        linkedIncidents: body.linkedIncidents ? JSON.stringify(body.linkedIncidents) : null,
        linkedReports: body.linkedReports ? JSON.stringify(body.linkedReports) : null,
        linkedCalls: body.linkedCalls ? JSON.stringify(body.linkedCalls) : null,
        securityLevel: body.securityLevel || "STANDARD",
        assignedTeam: body.assignedTeam,
        createdBy: body.createdBy
      }
    });
    
    // Create timeline entry
    await prisma.investigationTimeline.create({
      data: {
        investigationId: investigation.id,
        eventType: "CREATED",
        description: `Investigation created: ${investigation.title}`,
        metadata: JSON.stringify({
          classification: investigation.classification,
          priority: investigation.priority
        }),
        performedBy: body.createdBy
      }
    });
    
    return NextResponse.json({ investigation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create investigation:", error);
    return NextResponse.json(
      { error: "Failed to create investigation" },
      { status: 500 }
    );
  }
}
