import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const report = await prisma.civilianReport.create({
      data: {
        reporterName: body.reporterName,
        reporterContact: body.reporterContact || null,
        incidentType: body.incidentType,
        location: body.location || null,
        description: body.description,
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
