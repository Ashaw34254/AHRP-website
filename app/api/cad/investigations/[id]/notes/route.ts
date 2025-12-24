import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/cad/investigations/[id]/notes - Add note to investigation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const note = await prisma.investigationNote.create({
      data: {
        investigationId: params.id,
        noteType: body.noteType || "GENERAL",
        content: body.content,
        isInternal: body.isInternal !== undefined ? body.isInternal : true,
        isImportant: body.isImportant || false,
        mentionedOfficers: body.mentionedOfficers ? JSON.stringify(body.mentionedOfficers) : null,
        createdBy: body.createdBy
      }
    });
    
    // Update investigation last activity
    await prisma.investigation.update({
      where: { id: params.id },
      data: { lastActivityAt: new Date() }
    });
    
    // Create timeline entry
    await prisma.investigationTimeline.create({
      data: {
        investigationId: params.id,
        eventType: "NOTE_ADDED",
        description: `${body.noteType || "General"} note added`,
        performedBy: body.createdBy
      }
    });
    
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Failed to add note:", error);
    return NextResponse.json(
      { error: "Failed to add note" },
      { status: 500 }
    );
  }
}

// GET /api/cad/investigations/[id]/notes - Get all notes for investigation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const noteType = searchParams.get("noteType");
    const importantOnly = searchParams.get("importantOnly") === "true";
    
    const where: any = { investigationId: params.id };
    
    if (noteType) {
      where.noteType = noteType;
    }
    
    if (importantOnly) {
      where.isImportant = true;
    }
    
    const notes = await prisma.investigationNote.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    
    // Parse mentioned officers
    const parsedNotes = notes.map(n => ({
      ...n,
      mentionedOfficers: n.mentionedOfficers ? JSON.parse(n.mentionedOfficers) : []
    }));
    
    return NextResponse.json({ notes: parsedNotes });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
