import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");
    const days = searchParams.get("days");

    // Build where clause
    const where: any = {};

    // Filter by status (default to active calls)
    if (status) {
      where.status = {
        in: status.split(","),
      };
    } else {
      where.status = {
        in: ["PENDING", "DISPATCHED", "ACTIVE"],
      };
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by priority
    if (priority) {
      where.priority = priority;
    }

    // Filter by search term (call number or location)
    if (search) {
      where.OR = [
        { callNumber: { contains: search } },
        { location: { contains: search } },
      ];
    }

    // Filter by date range
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.createdAt = {
        gte: daysAgo,
      };
    }

    const calls = await prisma.call.findMany({
      where,
      include: {
        units: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ calls });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      priority,
      location,
      postal,
      description,
      caller,
      callerPhone,
      createdById,
    } = body;

    // Validate required fields
    if (!type || !location || !description) {
      return NextResponse.json(
        { error: "Type, location, and description are required" },
        { status: 400 }
      );
    }

    // Generate call number (format: 2025-XXXXXX)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    const callNumber = `${year}-${randomNum}`;

    // Check if user exists, if not create a dev user (for development mode)
    let userId = createdById;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!userExists) {
        // Create dev user if doesn't exist
        await prisma.user.create({
          data: {
            id: userId,
            name: "Dev User",
            email: "dev@aurorahorizon.local",
          },
        });
      }
    }

    const call = await prisma.call.create({
      data: {
        callNumber,
        type,
        priority: priority || "MEDIUM",
        status: "PENDING",
        location,
        postal: postal || null,
        description,
        caller: caller || null,
        callerPhone: callerPhone || null,
        createdById: userId || "dev-user-1",
      },
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
