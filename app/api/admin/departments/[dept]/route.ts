import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/departments/[dept] - Get specific department settings
export async function GET(
  request: Request,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept: deptParam } = await params;
    const dept = deptParam.toUpperCase();
    const validDepts = ["POLICE", "FIRE", "EMS"];

    if (!validDepts.includes(dept)) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }

    // Try DepartmentSettings first, fall back to Department
    const settings = await prisma.departmentSettings.findUnique({
      where: { department: dept },
    });

    if (settings) {
      return NextResponse.json({ settings });
    }

    // Fall back to Department model
    const department = await prisma.department.findUnique({
      where: { name: dept },
    });

    if (department) {
      return NextResponse.json({ department });
    }

    return NextResponse.json(
      { error: "Department not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/departments/[dept] - Update specific department
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept: deptParam } = await params;
    const dept = deptParam.toUpperCase();
    const validDepts = ["POLICE", "FIRE", "EMS"];

    if (!validDepts.includes(dept)) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }

    const updates = await request.json();
    const updateData: Record<string, unknown> = {};

    if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
    if (updates.maxUnits !== undefined) updateData.maxUnits = updates.maxUnits;
    if (updates.requireCertification !== undefined) updateData.requireCertification = updates.requireCertification;
    if (updates.autoApprove !== undefined) updateData.autoApprove = updates.autoApprove;
    if (updates.allowRecruitment !== undefined) updateData.allowRecruitment = updates.allowRecruitment;
    if (updates.minPlaytime !== undefined) updateData.minPlaytime = updates.minPlaytime;
    if (updates.discordRole !== undefined) updateData.discordRole = updates.discordRole;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.homepageContent !== undefined) updateData.homepageContent = updates.homepageContent;
    if (updates.motto !== undefined) updateData.motto = updates.motto;
    if (updates.theme !== undefined) updateData.theme = typeof updates.theme === "string" ? updates.theme : JSON.stringify(updates.theme);
    if (updates.ranks !== undefined) updateData.ranks = typeof updates.ranks === "string" ? updates.ranks : JSON.stringify(updates.ranks);
    if (updates.members !== undefined) updateData.members = typeof updates.members === "string" ? updates.members : JSON.stringify(updates.members);
    if (updates.announcements !== undefined) updateData.announcements = typeof updates.announcements === "string" ? updates.announcements : JSON.stringify(updates.announcements);

    const settings = await prisma.departmentSettings.upsert({
      where: { department: dept },
      update: updateData,
      create: {
        department: dept,
        theme: "{}",
        ...updateData,
      },
    });

    return NextResponse.json({
      message: `Department ${dept} updated successfully`,
      settings,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}
