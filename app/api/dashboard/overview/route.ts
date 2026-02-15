import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/overview - Get dashboard overview data
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id!;

    // Get user's characters
    const characters = await prisma.character.findMany({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        image: true,
        occupation: true,
        phoneNumber: true,
        department: true,
        rank: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get associated officers for this user
    const officers = await prisma.officer.findMany({
      where: { userId },
      select: {
        id: true,
        callsign: true,
        rank: true,
        department: true,
        dutyStatus: true,
      },
    });

    // Get user's applications
    const applications = await prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        submittedDate: true,
        reviewedAt: true,
        applicationType: true,
      },
      orderBy: { submittedDate: 'desc' },
      take: 5,
    });

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        rsvps: {
          where: { userId },
          select: { status: true },
        },
        _count: {
          select: { rsvps: true },
        },
      },
      orderBy: { startTime: 'asc' },
      take: 5,
    });

    // Get user stats
    const stats = {
      totalCharacters: characters.length,
      activeCharacters: officers.filter((o: typeof officers[number]) => o.dutyStatus === 'AVAILABLE').length,
      pendingApplications: applications.filter((a: typeof applications[number]) => a.status === 'pending').length,
      upcomingEvents: upcomingEvents.length,
    };

    // Merge officer data with characters where applicable
    const charactersWithOfficers = characters.map((char: typeof characters[number]) => {
      const officer = officers.find((o: typeof officers[number]) => o.department === char.department);
      return {
        ...char,
        officer: officer || null,
      };
    });

    return NextResponse.json({
      success: true,
      characters: charactersWithOfficers,
      applications,
      events: upcomingEvents,
      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
