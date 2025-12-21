import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// TODO: Add AuditLog model to Prisma schema before enabling this route
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: "Audit log feature not yet implemented" },
    { status: 501 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Audit log feature not yet implemented" },
    { status: 501 }
  );
}

/* 
// Disabled until AuditLog model is added to schema
export async function GET_DISABLED(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const action = searchParams.get("action");
    const resource = searchParams.get("resource");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { userName: { contains: search, mode: "insensitive" } },
        { resource: { contains: search, mode: "insensitive" } },
        { details: { contains: search, mode: "insensitive" } },
      ];
    }

    if (action && action !== "ALL") {
      where.action = action;
    }

    if (resource && resource !== "ALL") {
      where.resource = resource;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo + "T23:59:59.999Z");
      }
    }

    // Fetch logs with pagination
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

export async function POST_DISABLED(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, action, resource, resourceId, details } = body;

    // Get IP address from request
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    const log = await prisma.auditLog.create({
      data: {
        userId,
        userName,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating audit log:", error);
    return NextResponse.json(
      { error: "Failed to create audit log" },
      { status: 500 }
    );
  }
}
*/
