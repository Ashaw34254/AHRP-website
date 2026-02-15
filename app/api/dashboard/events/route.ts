import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/events - Get events for user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // upcoming, past, my-rsvps

    let where: any = {};

    if (filter === "upcoming") {
      where.startTime = { gte: new Date() };
    } else if (filter === "past") {
      where.startTime = { lt: new Date() };
    } else if (filter === "my-rsvps") {
      where.rsvps = {
        some: {
          userId: session.user.id!,
        },
      };
    } else {
      // Default to upcoming
      where.startTime = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        rsvps: {
          where: { userId: session.user.id! },
          select: { status: true, createdAt: true },
        },
        _count: {
          select: { rsvps: true },
        },
      },
      orderBy: { startTime: filter === "past" ? 'desc' : 'asc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/events - RSVP to an event
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !status) {
      return NextResponse.json(
        { success: false, message: "Event ID and status are required" },
        { status: 400 }
      );
    }

    // Check if event exists and has space
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { rsvps: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (event.maxAttendees && event._count.rsvps >= event.maxAttendees && status === "ATTENDING") {
      return NextResponse.json(
        { success: false, message: "Event is full" },
        { status: 400 }
      );
    }

    // Create or update RSVP
    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id!,
        },
      },
      create: {
        userId: session.user.id!,
        eventId,
        status,
      },
      update: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      rsvp,
    });
  } catch (error) {
    console.error("Error creating RSVP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
