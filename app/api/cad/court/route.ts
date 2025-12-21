import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const cases = await prisma.courtCase.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Failed to fetch court cases:", error);
    return NextResponse.json({ error: "Failed to fetch court cases" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      caseType,
      filingDate,
      hearingDate,
      courtLocation,
      prosecutorName,
      defendantName,
      charges,
      notes,
      incidentReportId,
    } = body;

    if (!title || !defendantName || !charges || !filingDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate docket number (format: DC-YYYY-XXXXX)
    const year = new Date(filingDate).getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const docketNumber = `DC-${year}-${randomNum}`;

    const courtCase = await prisma.courtCase.create({
      data: {
        docketNumber,
        title,
        caseType: caseType || "CRIMINAL",
        filingDate: new Date(filingDate),
        hearingDate: hearingDate ? new Date(hearingDate) : null,
        courtLocation: courtLocation || "",
        prosecutorName: prosecutorName || null,
        defendantName,
        charges,
        status: "FILED",
        notes: notes || null,
        incidentReportId: incidentReportId || null,
      },
    });

    return NextResponse.json({ case: courtCase });
  } catch (error) {
    console.error("Failed to create court case:", error);
    return NextResponse.json({ error: "Failed to create court case" }, { status: 500 });
  }
}
