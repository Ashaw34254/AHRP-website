import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/cad/investigations/[id]/tasks - Create task for investigation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const task = await prisma.investigationTask.create({
      data: {
        investigationId: id,
        title: body.title,
        description: body.description,
        assignedTo: body.assignedTo,
        priority: body.priority || "MEDIUM",
        status: body.status || "PENDING",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        createdBy: body.createdBy
      }
    });
    
    // Update investigation last activity
    await prisma.investigation.update({
      where: { id },
      data: { lastActivityAt: new Date() }
    });
    
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET /api/cad/investigations/[id]/tasks - Get all tasks for investigation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");
    
    const where: any = { investigationId: id };
    
    if (status) {
      where.status = status;
    }
    
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }
    
    const tasks = await prisma.investigationTask.findMany({
      where,
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { dueDate: "asc" }
      ]
    });
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
