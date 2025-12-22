import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/departments - Get all department settings
export async function GET() {
  try {
    // For now, return mock data since we don't have Department model in Prisma yet
    // TODO: Add Department model to Prisma schema
    
    const mockDepartments = {
      POLICE: {
        enabled: true,
        maxUnits: 20,
        requireCertification: true,
        autoApprove: false,
        allowRecruitment: true,
        minPlaytime: 10,
        discordRole: "Police Officer",
        theme: {
          name: "Police Department",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
          accentColor: "#60A5FA",
          logoUrl: "",
          badgeUrl: "",
          bannerUrl: "",
          customCSS: "",
          enableGradient: true,
          gradientDirection: "to-br",
          borderStyle: "solid",
          cardOpacity: 90,
        },
        ranks: [],
        members: [],
      },
      FIRE: {
        enabled: true,
        maxUnits: 15,
        requireCertification: true,
        autoApprove: false,
        allowRecruitment: true,
        minPlaytime: 8,
        discordRole: "Firefighter",
        theme: {
          name: "Fire Department",
          primaryColor: "#EF4444",
          secondaryColor: "#991B1B",
          accentColor: "#F87171",
          logoUrl: "",
          badgeUrl: "",
          bannerUrl: "",
          customCSS: "",
          enableGradient: true,
          gradientDirection: "to-br",
          borderStyle: "solid",
          cardOpacity: 90,
        },
        ranks: [],
        members: [],
      },
      EMS: {
        enabled: true,
        maxUnits: 12,
        requireCertification: true,
        autoApprove: false,
        allowRecruitment: true,
        minPlaytime: 8,
        discordRole: "EMS",
        theme: {
          name: "Emergency Medical Services",
          primaryColor: "#10B981",
          secondaryColor: "#065F46",
          accentColor: "#34D399",
          logoUrl: "",
          badgeUrl: "",
          bannerUrl: "",
          customCSS: "",
          enableGradient: true,
          gradientDirection: "to-br",
          borderStyle: "solid",
          cardOpacity: 90,
        },
        ranks: [],
        members: [],
      },
    };

    return NextResponse.json(mockDepartments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/departments - Update all department settings
export async function PUT(request: Request) {
  try {
    const departments = await request.json();

    // Validate departments data
    const validDepts = ["POLICE", "FIRE", "EMS"];
    for (const dept of Object.keys(departments)) {
      if (!validDepts.includes(dept)) {
        return NextResponse.json(
          { error: `Invalid department: ${dept}` },
          { status: 400 }
        );
      }
    }

    // TODO: Save to database via Prisma
    // For now, just return success
    // await prisma.department.upsert(...)

    return NextResponse.json({
      message: "Department settings updated successfully",
      departments,
    });
  } catch (error) {
    console.error("Error updating departments:", error);
    return NextResponse.json(
      { error: "Failed to update departments" },
      { status: 500 }
    );
  }
}
