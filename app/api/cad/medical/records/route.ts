import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const records = await prisma.medicalRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Failed to fetch medical records:", error);
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      dateOfBirth,
      bloodType,
      allergies,
      medications,
      conditions,
      emergencyContact,
      insuranceInfo,
      updatedBy,
      patientId,
      stateId,
    } = body;

    if (!patientName) {
      return NextResponse.json({ error: "Patient name is required" }, { status: 400 });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientName,
        dateOfBirth: dateOfBirth || "",
        bloodType: bloodType || null,
        allergies: allergies || null,
        medications: medications || null,
        conditions: conditions || null,
        emergencyContact: emergencyContact || null,
        insuranceInfo: insuranceInfo || null,
        updatedBy: updatedBy || "System",
        patientId: patientId || null,
        stateId: stateId || null,
      },
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Failed to create medical record:", error);
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 });
  }
}
