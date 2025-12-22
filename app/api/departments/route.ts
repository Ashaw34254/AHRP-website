import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/departments - Get all departments with full details
export async function GET(request: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        stations: true,
        divisions: true,
        ranks: {
          orderBy: { level: 'asc' },
          include: {
            members: true
          }
        },
        members: {
          include: {
            rank: true
          }
        }
      }
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// POST /api/departments - Create new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const department = await prisma.department.create({
      data: {
        name: body.name,
        displayName: body.displayName,
        motto: body.motto,
        description: body.description,
        homepageContent: body.homepageContent,
        primaryColor: body.primaryColor || "#3B82F6",
        secondaryColor: body.secondaryColor || "#2563EB",
        accentColor: body.accentColor || "#1D4ED8",
        logoUrl: body.logoUrl,
        badgeUrl: body.badgeUrl,
        bannerUrl: body.bannerUrl,
        customCSS: body.customCSS,
        enableGradient: body.enableGradient ?? true,
        gradientDirection: body.gradientDirection || "to right",
        borderStyle: body.borderStyle || "solid",
        cardOpacity: body.cardOpacity ?? 0.5,
        enabled: body.enabled ?? true,
        maxUnits: body.maxUnits || 20,
        requireCertification: body.requireCertification ?? false,
        autoApprove: body.autoApprove ?? false,
        allowRecruitment: body.allowRecruitment ?? true,
        minPlaytime: body.minPlaytime || 0,
        discordRole: body.discordRole
      }
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}

// PUT /api/departments - Update all departments (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { departments } = body;

    if (!departments || typeof departments !== "object") {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Update each department
    const updatePromises = Object.entries(departments).map(async ([deptName, data]: [string, any]) => {
      // Check if department exists
      const existing = await prisma.department.findUnique({
        where: { name: deptName }
      });

      if (existing) {
        // Update existing department
        return prisma.department.update({
          where: { name: deptName },
          data: {
            displayName: data.theme.displayName,
            motto: data.motto,
            description: data.description,
            homepageContent: data.homepageContent,
            primaryColor: data.theme.primaryColor,
            secondaryColor: data.theme.secondaryColor,
            accentColor: data.theme.accentColor,
            logoUrl: data.theme.logoUrl,
            badgeUrl: data.theme.badgeUrl,
            bannerUrl: data.theme.bannerUrl,
            customCSS: data.theme.customCSS,
            enableGradient: data.theme.enableGradient,
            gradientDirection: data.theme.gradientDirection,
            borderStyle: data.theme.borderStyle,
            cardOpacity: data.theme.cardOpacity,
            enabled: data.enabled,
            maxUnits: data.maxUnits,
            requireCertification: data.requireCertification,
            autoApprove: data.autoApprove,
            allowRecruitment: data.allowRecruitment,
            minPlaytime: data.minPlaytime,
            discordRole: data.discordRole
          }
        });
      } else {
        // Create new department
        return prisma.department.create({
          data: {
            name: deptName,
            displayName: data.theme.displayName,
            motto: data.motto,
            description: data.description,
            homepageContent: data.homepageContent,
            primaryColor: data.theme.primaryColor,
            secondaryColor: data.theme.secondaryColor,
            accentColor: data.theme.accentColor,
            logoUrl: data.theme.logoUrl,
            badgeUrl: data.theme.badgeUrl,
            bannerUrl: data.theme.bannerUrl,
            customCSS: data.theme.customCSS,
            enableGradient: data.theme.enableGradient,
            gradientDirection: data.theme.gradientDirection,
            borderStyle: data.theme.borderStyle,
            cardOpacity: data.theme.cardOpacity,
            enabled: data.enabled,
            maxUnits: data.maxUnits,
            requireCertification: data.requireCertification,
            autoApprove: data.autoApprove,
            allowRecruitment: data.allowRecruitment,
            minPlaytime: data.minPlaytime,
            discordRole: data.discordRole
          }
        });
      }
    });

    await Promise.all(updatePromises);

    // Return updated departments
    const updated = await prisma.department.findMany({
      include: {
        stations: true,
        divisions: true,
        ranks: {
          orderBy: { level: 'asc' }
        },
        members: {
          include: {
            rank: true
          }
        }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating departments:", error);
    return NextResponse.json(
      { error: "Failed to update departments" },
      { status: 500 }
    );
  }
}
