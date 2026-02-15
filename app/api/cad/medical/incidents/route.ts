import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const incidents = await prisma.medicalIncident.findMany({
      orderBy: {
        incidentDate: "desc",
      },
    });

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error("Failed to fetch medical incidents:", error);
    return NextResponse.json({ error: "Failed to fetch medical incidents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      medicalRecordId,
      callId,
      incidentDate,
      chiefComplaint,
      treatment,
      medications,
      vitalSigns,
      transportedTo,
      disposition,
      treatedBy,
    } = body;

    if (!medicalRecordId || !chiefComplaint || !treatment || !treatedBy || !incidentDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const incident = await prisma.medicalIncident.create({
      data: {
        medicalRecordId,
        callId: callId || null,
        incidentDate: new Date(incidentDate),
        chiefComplaint,
        treatment,
        medications: medications || null,
        vitalSigns: vitalSigns || null,
        transportedTo: transportedTo || null,
        disposition: disposition || "TRANSPORTED",
        treatedBy,
      },
    });

    return NextResponse.json({ incident });
  } catch (error) {
    console.error("Failed to create medical incident:", error);
    return NextResponse.json({ error: "Failed to create medical incident" }, { status: 500 });
  }
}
