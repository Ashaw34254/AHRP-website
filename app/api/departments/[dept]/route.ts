import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/departments/[dept] - Get specific department
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    
    const department = await prisma.department.findUnique({
      where: { name: deptName },
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

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

// PATCH /api/departments/[dept] - Update specific department
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    const body = await request.json();

    const department = await prisma.department.update({
      where: { name: deptName },
      data: {
        displayName: body.displayName,
        motto: body.motto,
        description: body.description,
        homepageContent: body.homepageContent,
        primaryColor: body.primaryColor,
        secondaryColor: body.secondaryColor,
        accentColor: body.accentColor,
        logoUrl: body.logoUrl,
        badgeUrl: body.badgeUrl,
        bannerUrl: body.bannerUrl,
        customCSS: body.customCSS,
        enableGradient: body.enableGradient,
        gradientDirection: body.gradientDirection,
        borderStyle: body.borderStyle,
        cardOpacity: body.cardOpacity,
        enabled: body.enabled,
        maxUnits: body.maxUnits,
        requireCertification: body.requireCertification,
        autoApprove: body.autoApprove,
        allowRecruitment: body.allowRecruitment,
        minPlaytime: body.minPlaytime,
        discordRole: body.discordRole
      },
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

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}
