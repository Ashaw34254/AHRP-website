import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const reports = await prisma.incidentReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      reportNumber: report.reportNumber,
      title: report.title,
      reportedBy: report.reportedBy,
      occurredAt: report.occurredAt.toISOString(),
      location: report.location,
      type: report.type,
      status: report.status,
      narrative: report.narrative,
      suspects: report.suspects,
      victims: report.victims,
      witnesses: report.witnesses,
      evidence: report.evidence,
      approvedBy: report.approvedBy,
      callId: report.callId,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error("Failed to fetch incident reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      reportedBy,
      occurredAt,
      location,
      type,
      narrative,
      callId,
    } = body;

    if (!title || !reportedBy || !occurredAt || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate report number (format: IR-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const reportNumber = `IR-${dateStr}-${randomNum}`;

    const report = await prisma.incidentReport.create({
      data: {
        reportNumber,
        title,
        reportedBy,
        occurredAt: new Date(occurredAt),
        location,
        type: type || "INCIDENT",
        status: "DRAFT",
        narrative: narrative || "",
        callId: callId || null,
      },
    });

    return NextResponse.json({
      report: {
        id: report.id,
        reportNumber: report.reportNumber,
        title: report.title,
        reportedBy: report.reportedBy,
        occurredAt: report.occurredAt.toISOString(),
        location: report.location,
        type: report.type,
        status: report.status,
        narrative: report.narrative,
        suspects: report.suspects,
        victims: report.victims,
        witnesses: report.witnesses,
        evidence: report.evidence,
        approvedBy: report.approvedBy,
        callId: report.callId,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to create incident report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
