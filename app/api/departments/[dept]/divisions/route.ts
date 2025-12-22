import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/departments/[dept]/divisions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    
    const department = await prisma.department.findUnique({
      where: { name: deptName },
      select: { id: true }
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const divisions = await prisma.division.findMany({
      where: { departmentId: department.id }
    });

    return NextResponse.json(divisions);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return NextResponse.json({ error: "Failed to fetch divisions" }, { status: 500 });
  }
}

// POST /api/departments/[dept]/divisions - Create division
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    const body = await request.json();
    
    const department = await prisma.department.findUnique({
      where: { name: deptName },
      select: { id: true }
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const division = await prisma.division.create({
      data: {
        departmentId: department.id,
        name: body.name,
        icon: body.icon,
        memberCount: body.memberCount || 0,
        description: body.description
      }
    });

    return NextResponse.json(division);
  } catch (error) {
    console.error("Error creating division:", error);
    return NextResponse.json({ error: "Failed to create division" }, { status: 500 });
  }
}

// PUT /api/departments/[dept]/divisions - Bulk update divisions
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    const body = await request.json();
    const { divisions } = body;

    const department = await prisma.department.findUnique({
      where: { name: deptName },
      select: { id: true }
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // Delete existing divisions
    await prisma.division.deleteMany({
      where: { departmentId: department.id }
    });

    // Create new divisions
    if (divisions && divisions.length > 0) {
      await prisma.division.createMany({
        data: divisions.map((division: any) => ({
          departmentId: department.id,
          name: division.name,
          icon: division.icon,
          memberCount: division.memberCount || 0,
          description: division.description
        }))
      });
    }

    const updated = await prisma.division.findMany({
      where: { departmentId: department.id }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating divisions:", error);
    return NextResponse.json({ error: "Failed to update divisions" }, { status: 500 });
  }
}
