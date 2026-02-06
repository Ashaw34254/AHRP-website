import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/cad/investigations/[id]/tasks/[taskId] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    const body = await request.json();
    const updateData: any = {};
    
    if (body.title) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.assignedTo) updateData.assignedTo = body.assignedTo;
    if (body.priority) updateData.priority = body.priority;
    if (body.status) updateData.status = body.status;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.result !== undefined) updateData.result = body.result;
    
    // Handle completion
    if (body.status === "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.completedBy = body.completedBy || body.updatedBy;
    }
    
    const task = await prisma.investigationTask.update({
      where: { id: taskId },
      data: updateData
    });
    
    // Update investigation last activity
    await prisma.investigation.update({
      where: { id },
      data: { lastActivityAt: new Date() }
    });
    
    // Create timeline entry if task completed
    if (body.status === "COMPLETED") {
      await prisma.investigationTimeline.create({
        data: {
          investigationId: id,
          eventType: "TASK_COMPLETED",
          description: `Task completed: ${task.title}`,
          performedBy: body.completedBy || body.updatedBy || "System"
        }
      });
    }
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/cad/investigations/[id]/tasks/[taskId] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await prisma.investigationTask.delete({
      where: { id: taskId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
