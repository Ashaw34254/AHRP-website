import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await auth();
    
    // Ensure formData exists and is stringified
    const formDataString = data.formData 
      ? JSON.stringify(data.formData) 
      : JSON.stringify({});
    
    const isDraft = data.isDraft === true;
    
    const application = await prisma.application.create({
      data: {
        applicationType: data.applicationType,
        formData: formDataString,
        userId: session?.user?.id || null,
        status: isDraft ? "DRAFT" : "PENDING",
        isDraft: isDraft,
        submittedDate: isDraft ? null : new Date(),
        lastSavedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: isDraft ? "Draft saved successfully" : "Application submitted successfully",
      applicationId: application.id,
      isDraft,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const includeDrafts = searchParams.get("includeDrafts") === "true";
    
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (!includeDrafts) {
      where.isDraft = false; // Exclude drafts by default
    }
    
    const applications = await prisma.application.findMany({
      where,
      orderBy: { lastSavedAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Parse JSON formData for each application
    const applicationsWithParsedData = applications.map(app => ({
      ...app,
      formData: JSON.parse(app.formData),
    }));
    
    return NextResponse.json({
      success: true,
      applications: applicationsWithParsedData,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const session = await auth();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, message: "Application ID is required" },
        { status: 400 }
      );
    }
    
    // Verify the application belongs to the user
    const existing = await prisma.application.findUnique({
      where: { id: data.id },
    });
    
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }
    
    if (existing.userId !== session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const formDataString = data.formData 
      ? JSON.stringify(data.formData) 
      : existing.formData;
    
    const isDraft = data.isDraft === true;
    
    const application = await prisma.application.update({
      where: { id: data.id },
      data: {
        formData: formDataString,
        status: isDraft ? "DRAFT" : "PENDING",
        isDraft: isDraft,
        submittedDate: isDraft ? existing.submittedDate : new Date(),
        lastSavedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: isDraft ? "Draft updated successfully" : "Application submitted successfully",
      application,
      isDraft,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update application" },
      { status: 500 }
    );
  }
}
