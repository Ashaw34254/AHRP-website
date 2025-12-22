import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard/characters/[id]/police
 * Get all police-related records for a character
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // Mock police data for development
      return NextResponse.json({
        success: true,
        data: {
          notes: [
            {
              id: "1",
              title: "Traffic Stop",
              content: "Routine traffic stop on Highway 1. Driver was cooperative.",
              category: "CONTACT",
              createdBy: "Officer Smith",
              source: "user",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
          flags: [
            {
              id: "1",
              flagType: "CAUTION",
              reason: "Previously armed during traffic stop",
              severity: "MEDIUM",
              isActive: true,
              createdBy: "Dispatch",
              source: "cad",
              createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
          ],
          warrants: [],
          citations: [
            {
              id: "1",
              violation: "Speeding (65 in a 45 zone)",
              fine: 150,
              notes: "Highway 1, northbound",
              location: "Highway 1 Mile Marker 23",
              isPaid: false,
              issuedBy: "Officer Johnson",
              source: "user",
              issuedAt: new Date(Date.now() - 259200000).toISOString(),
              createdAt: new Date(Date.now() - 259200000).toISOString(),
            },
          ],
          arrests: [],
        },
      });
    }

    // Verify character ownership
    const character = await prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Character not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch all police records
    const [notes, flags, warrants, citations, arrests] = await Promise.all([
      prisma.characterNote.findMany({
        where: { characterId: id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.characterFlag.findMany({
        where: { characterId: id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.characterWarrant.findMany({
        where: { characterId: id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.characterCitation.findMany({
        where: { characterId: id },
        orderBy: { issuedAt: "desc" },
      }),
      prisma.characterArrest.findMany({
        where: { characterId: id },
        orderBy: { arrestedAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notes,
        flags,
        warrants,
        citations,
        arrests,
      },
    });
  } catch (error: any) {
    console.error("Error fetching police records:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch police records" },
      { status: 500 }
    );
  }
}
