import { NextResponse } from "next/server";

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

    // TODO: Fetch from database
    // const department = await prisma.department.findUnique({ where: { name: dept } });

    return NextResponse.json({
      message: `Department ${dept} settings`,
      // department,
    });
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

    // TODO: Update in database
    // await prisma.department.update({ where: { name: dept }, data: updates });

    return NextResponse.json({
      message: `Department ${dept} updated successfully`,
      updates,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}
