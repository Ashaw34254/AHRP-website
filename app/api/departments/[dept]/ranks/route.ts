import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/departments/[dept]/ranks
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

    const ranks = await prisma.rank.findMany({
      where: { departmentId: department.id },
      orderBy: { level: 'asc' },
      include: {
        members: true
      }
    });

    return NextResponse.json(ranks);
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return NextResponse.json({ error: "Failed to fetch ranks" }, { status: 500 });
  }
}

// POST /api/departments/[dept]/ranks - Create rank
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

    const rank = await prisma.rank.create({
      data: {
        departmentId: department.id,
        name: body.name,
        abbreviation: body.abbreviation,
        level: body.level,
        permissions: JSON.stringify(body.permissions || []),
        payGrade: body.payGrade,
        color: body.color
      }
    });

    return NextResponse.json(rank);
  } catch (error) {
    console.error("Error creating rank:", error);
    return NextResponse.json({ error: "Failed to create rank" }, { status: 500 });
  }
}

// PUT /api/departments/[dept]/ranks - Bulk update ranks
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    const body = await request.json();
    const { ranks } = body;

    const department = await prisma.department.findUnique({
      where: { name: deptName },
      select: { id: true }
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // Delete existing ranks (this will cascade delete members)
    await prisma.rank.deleteMany({
      where: { departmentId: department.id }
    });

    // Create new ranks
    if (ranks && ranks.length > 0) {
      await prisma.rank.createMany({
        data: ranks.map((rank: any) => ({
          departmentId: department.id,
          name: rank.name,
          abbreviation: rank.abbreviation,
          level: rank.level,
          permissions: JSON.stringify(rank.permissions || []),
          payGrade: rank.payGrade,
          color: rank.color
        }))
      });
    }

    const updated = await prisma.rank.findMany({
      where: { departmentId: department.id },
      orderBy: { level: 'asc' }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating ranks:", error);
    return NextResponse.json({ error: "Failed to update ranks" }, { status: 500 });
  }
}
