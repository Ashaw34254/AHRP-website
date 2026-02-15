import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate report number
    const count = await prisma.civilianReport.count();
    const reportNumber = `CR-${String(count + 1).padStart(5, "0")}`;

    const report = await prisma.civilianReport.create({
      data: {
        reportNumber,
        reporterName: body.reporterName,
        reporterEmail: body.reporterEmail || null,
        reporterPhone: body.reporterPhone || null,
        type: body.type || body.incidentType,
        subject: body.subject || body.incidentType,
        description: body.description,
        location: body.location || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error creating civilian report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.civilianReport.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching civilian reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
