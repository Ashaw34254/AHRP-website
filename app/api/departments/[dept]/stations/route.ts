import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/departments/[dept]/stations
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

    const stations = await prisma.station.findMany({
      where: { departmentId: department.id }
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}

// POST /api/departments/[dept]/stations - Create station
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

    const station = await prisma.station.create({
      data: {
        departmentId: department.id,
        name: body.name,
        address: body.address,
        phone: body.phone,
        staffCount: body.staffCount || 0,
        status: body.status || "Active",
        imageUrl: body.imageUrl
      }
    });

    return NextResponse.json(station);
  } catch (error) {
    console.error("Error creating station:", error);
    return NextResponse.json({ error: "Failed to create station" }, { status: 500 });
  }
}

// PUT /api/departments/[dept]/stations - Bulk update stations
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dept: string }> }
) {
  try {
    const { dept } = await params;
    const deptName = dept.toUpperCase();
    const body = await request.json();
    const { stations } = body;

    const department = await prisma.department.findUnique({
      where: { name: deptName },
      select: { id: true }
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // Delete existing stations
    await prisma.station.deleteMany({
      where: { departmentId: department.id }
    });

    // Create new stations
    if (stations && stations.length > 0) {
      await prisma.station.createMany({
        data: stations.map((station: any) => ({
          departmentId: department.id,
          name: station.name,
          address: station.address,
          phone: station.phone,
          staffCount: station.staffCount || 0,
          status: station.status || "Active",
          imageUrl: station.imageUrl
        }))
      });
    }

    const updated = await prisma.station.findMany({
      where: { departmentId: department.id }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating stations:", error);
    return NextResponse.json({ error: "Failed to update stations" }, { status: 500 });
  }
}
