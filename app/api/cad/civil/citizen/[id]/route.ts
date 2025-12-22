import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { isWanted, isMissing, address, phoneNumber } = body;

    const updatedCitizen = await prisma.citizen.update({
      where: { id },
      data: {
        isWanted: isWanted !== undefined ? isWanted : undefined,
        isMissing: isMissing !== undefined ? isMissing : undefined,
        address: address !== undefined ? address : undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
      },
      include: {
        warrants: {
          where: {
            isActive: true,
          },
        },
        vehicles: true,
      },
    });

    return NextResponse.json({ citizen: updatedCitizen });
  } catch (error) {
    console.error("Error updating citizen:", error);
    return NextResponse.json(
      { error: "Failed to update citizen" },
      { status: 500 }
    );
  }
}
