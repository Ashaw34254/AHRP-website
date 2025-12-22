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

    // Generate case number (format: DC-YYYY-XXXXX)
    const year = new Date(filingDate).getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const caseNumber = `DC-${year}-${randomNum}`;

    const courtCase = await prisma.courtCase.create({
      data: {
        caseNumber,
        defendantName,
        defendantId: null,
        charges: Array.isArray(charges) ? JSON.stringify(charges) : charges,
        status: "PENDING",
        filedDate: new Date(filingDate),
        courtDate: hearingDate ? new Date(hearingDate) : null,
        prosecutor: prosecutorName || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ case: courtCase });
  } catch (error) {
    console.error("Failed to create court case:", error);
    return NextResponse.json({ error: "Failed to create court case" }, { status: 500 });
  }
}
