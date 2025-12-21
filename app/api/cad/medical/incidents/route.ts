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
      patientName,
      chiefComplaint,
      incidentDate,
      location,
      transportedTo,
      respondingUnit,
      respondingEMT,
      vitals,
      treatment,
      disposition,
      notes,
      medicalRecordId,
    } = body;

    if (!patientName || !chiefComplaint || !incidentDate || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate incident number (format: MI-YYYYMMDD-XXXX)
    const date = new Date(incidentDate);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const incidentNumber = `MI-${dateStr}-${randomNum}`;

    const incident = await prisma.medicalIncident.create({
      data: {
        incidentNumber,
        patientName,
        chiefComplaint,
        incidentDate: new Date(incidentDate),
        location,
        transportedTo: transportedTo || null,
        respondingUnit: respondingUnit || "UNKNOWN",
        respondingEMT: respondingEMT || "UNKNOWN",
        vitals: vitals || null,
        treatment: treatment || null,
        disposition: disposition || "TRANSPORTED",
        notes: notes || null,
        medicalRecordId: medicalRecordId || null,
      },
    });

    return NextResponse.json({ incident });
  } catch (error) {
    console.error("Failed to create medical incident:", error);
    return NextResponse.json({ error: "Failed to create medical incident" }, { status: 500 });
  }
}
