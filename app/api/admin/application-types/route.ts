import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get all application types
export async function GET(request: Request) {
  try {
    const types = await prisma.applicationFormConfig.findMany({
      select: {
        name: true,
        title: true,
        description: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });
    
    return NextResponse.json({
      success: true,
      types,
    });
  } catch (error) {
    console.error("Error fetching application types:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch application types" },
      { status: 500 }
    );
  }
}

// Create new application type (Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    // Skip auth check in development mode
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { name, title, description } = data;
    
    // Validate input
    if (!name || !title) {
      return NextResponse.json(
        { success: false, message: "Name and title are required" },
        { status: 400 }
      );
    }
    
    // Check if type already exists
    const existing = await prisma.applicationFormConfig.findUnique({
      where: { name },
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Application type already exists" },
        { status: 409 }
      );
    }
    
    // Create new type
    const newType = await prisma.applicationFormConfig.create({
      data: {
        name: name.toLowerCase().replace(/\s+/g, "-"),
        title,
        description: description || "",
        isActive: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      type: newType,
    });
  } catch (error) {
    console.error("Error creating application type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create application type" },
      { status: 500 }
    );
  }
}

// Delete application type (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    // Skip auth check in development mode
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Application type name is required" },
        { status: 400 }
      );
    }
    
    // Delete form config (cascade will delete fields and applications)
    await prisma.applicationFormConfig.delete({
      where: { name },
    });
    
    return NextResponse.json({
      success: true,
      message: "Application type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete application type" },
      { status: 500 }
    );
  }
}
