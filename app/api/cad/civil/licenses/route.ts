import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const licenses = await prisma.businessLicense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ licenses });
  } catch (error) {
    console.error("Failed to fetch licenses:", error);
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessName,
      ownerName,
      licenseType,
      issueDate,
      expiryDate,
      address,
      notes,
    } = body;

    if (!businessName || !ownerName || !issueDate || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate license number (format: BL-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const licenseNumber = `BL-${dateStr}-${randomNum}`;

    const license = await prisma.businessLicense.create({
      data: {
        businessName,
        ownerName,
        ownerId: null,
        licenseType: licenseType || "BUSINESS_OPERATION",
        licenseNumber,
        issuedDate: new Date(issueDate),
        expiresAt: new Date(expiryDate),
        isActive: true,
        address: address || "",
        notes: notes || null,
      },
    });

    return NextResponse.json({ license });
  } catch (error) {
    console.error("Failed to create license:", error);
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}
