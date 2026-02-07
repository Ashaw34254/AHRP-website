import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/medical/[characterId] - Get medical records for a character/patient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    const { characterId } = await params;

    const records = await prisma.medicalRecord.findMany({
      where: {
        OR: [
          { patientId: characterId },
          { stateId: characterId },
        ],
      },
      include: {
        medicalIncidents: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 }
    );
  }
}

// PATCH /api/cad/medical/[characterId] - Update a medical record
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    const { characterId } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.bloodType !== undefined) updateData.bloodType = body.bloodType;
    if (body.allergies !== undefined) updateData.allergies = body.allergies;
    if (body.medications !== undefined) updateData.medications = body.medications;
    if (body.conditions !== undefined) updateData.conditions = body.conditions;
    if (body.emergencyContact !== undefined) updateData.emergencyContact = body.emergencyContact;
    if (body.insuranceInfo !== undefined) updateData.insuranceInfo = body.insuranceInfo;
    if (body.updatedBy !== undefined) updateData.updatedBy = body.updatedBy;

    updateData.lastUpdated = new Date();

    const record = await prisma.medicalRecord.update({
      where: { id: characterId },
      data: updateData,
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Error updating medical record:", error);
    return NextResponse.json(
      { error: "Failed to update medical record" },
      { status: 500 }
    );
  }
}
