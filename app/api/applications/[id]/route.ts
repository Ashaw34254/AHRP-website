import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Parse formData
    const parsedApplication = {
      ...application,
      formData: JSON.parse(application.formData),
    };

    return NextResponse.json({
      success: true,
      application: parsedApplication,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    // Check if user is admin (skip in dev mode)
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { status, reviewNotes, feedback } = data;
    
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,
        reviewNotes,
        feedback,
        reviewedBy: session?.user?.id || "admin",
        reviewedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Verify the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });
    
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }
    
    if (application.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    await prisma.application.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete application" },
      { status: 500 }
    );
  }
}
