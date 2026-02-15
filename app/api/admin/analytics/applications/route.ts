import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type ApplicationRecord = Awaited<ReturnType<typeof prisma.application.findMany>>[number];

export async function GET(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev && (!session?.user || !["admin", "owner"].includes(session.user.role))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all non-draft applications within the time range
    const applications = await prisma.application.findMany({
      where: {
        status: { not: "DRAFT" },
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
    });
    
    // Calculate statistics
    //const totalApplicationRecords = applications.length;
   // const pendingApplicationRecords = applications.filter(a => a.status === "PENDING").length;
   // const approvedApplicationRecords = applications.filter(a => a.status === "APPROVED").length;
   // const rejectedApplicationRecords = applications.filter(a => a.status === "REJECTED").length;
    
    // Calculate average processing time (for reviewed applications)
    const reviewedApplicationRecords = applications.filter((a: ApplicationRecord) => a.reviewedAt && a.submittedDate);
    const totalProcessingTime = reviewedApplicationRecords.reduce((sum: number, app: ApplicationRecord) => {
      const submitted = new Date(app.submittedDate!).getTime();
      const reviewed = new Date(app.reviewedAt!).getTime();
      return sum + (reviewed - submitted);
    }, 0);
    const averageProcessingTime = reviewedApplicationRecords.length > 0
      ? totalProcessingTime / reviewedApplicationRecords.length / (1000 * 60 * 60) // Convert to hours
      : 0;
    
    // Group by application type
    const applicationsByType: Record<string, number> = {};
    applications.forEach((app: ApplicationRecord) => {
      applicationsByType[app.applicationType] = (applicationsByType[app.applicationType] || 0) + 1;
    });

    // Group by status
    const applicationsByStatus: Record<string, number> = {};
    applications.forEach((app: ApplicationRecord) => {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    });
    
    // Generate submission trends (daily counts)
    const submissionTrends: Array<{ date: string; count: number }> = [];
    const trendDays = Math.min(days, 30); // Show max 30 days for trends
    
    for (let i = trendDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = applications.filter((app: ApplicationRecord) => {
        const appDate = new Date(app.createdAt);
        return appDate >= date && appDate < nextDate;
      }).length;
      
      submissionTrends.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }
    
    // Recent activity (last 20 applications)
    const recentActivity = applications.slice(0, 20).map((app: ApplicationRecord) => ({
      id: app.id,
      applicationType: app.applicationType,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
    }));
    
    return NextResponse.json({
      success: true,
      analytics: {
        //totalApplicationRecords,
       // pendingApplicationRecords,
        //approvedApplicationRecords,
        //rejectedApplicationRecords,
        averageProcessingTime,
        applicationsByType,
        applicationsByStatus,
        submissionTrends,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
