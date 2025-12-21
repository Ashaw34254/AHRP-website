import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all officer profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    const profiles = await prisma.officerProfile.findMany({
      where: department ? { department } : undefined,
      orderBy: { lastName: "asc" },
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Error fetching officer profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

// POST - Create new officer profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      badgeNumber,
      department,
      rank,
      division,
      certifications,
      specializations,
      avatarUrl,
    } = body;

    if (!firstName || !badgeNumber || !department) {
      return NextResponse.json(
        { error: "First name, badge number, and department are required" },
        { status: 400 }
      );
    }

    const profile = await prisma.officerProfile.create({
      data: {
        officerId: `off-${Date.now()}`,
        firstName,
        lastName: lastName || "",
        badgeNumber,
        department,
        rank: rank || "Officer",
        division,
        hireDate: new Date(),
        certifications: certifications ? JSON.stringify(certifications) : null,
        specializations: specializations ? JSON.stringify(specializations) : null,
        avatarUrl,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("Error creating officer profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
