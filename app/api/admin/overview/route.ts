import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get admin overview statistics
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
    
    // Get counts
    const [
      totalUsers,
      totalApplications,
      pendingApplications,
      approvedApplications,
      totalCharacters,
      totalEvents,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.application.count({ where: { status: { not: "DRAFT" } } }),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.character.count(),
      prisma.event.count(),
    ]);
    
    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            characters: true,
          },
        },
      },
    });
    
    // Get recent applications (last 10, non-drafts)
    const recentApplications = await prisma.application.findMany({
      where: { status: { not: "DRAFT" } },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        applicationType: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalCharacters,
        totalEvents,
      },
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        characterCount: user._count.characters,
      })),
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        type: app.applicationType,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        userName: app.user?.name || "Unknown",
        userEmail: app.user?.email || "",
      })),
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
