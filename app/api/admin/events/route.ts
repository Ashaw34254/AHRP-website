import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get all events
export async function GET() {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const events = await prisma.event.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate?.toISOString(),
        location: event.location,
        type: event.type || "community",
        maxParticipants: event.maxParticipants,
        participants: event._count.rsvps,
        createdAt: event.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Create event
export async function POST(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        location: data.location,
        type: data.type,
        maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
      },
    });
    
    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}

// Update event
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { eventId, updates } = await request.json();
    
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID required" },
        { status: 400 }
      );
    }
    
    const updateData: any = { ...updates };
    if (updates.startDate) {
      updateData.startDate = new Date(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = new Date(updates.endDate);
    }
    if (updates.maxParticipants) {
      updateData.maxParticipants = parseInt(updates.maxParticipants);
    }
    
    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Delete event
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID required" },
        { status: 400 }
      );
    }
    
    await prisma.event.delete({
      where: { id: eventId },
    });
    
    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event" },
      { status: 500 }
    );
  }
}
