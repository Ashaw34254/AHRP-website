import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const actions = await prisma.quickAction.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ actions });
  } catch (error) {
    console.error("Failed to fetch quick actions:", error);
    return NextResponse.json({ error: "Failed to fetch quick actions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      actionType,
      config,
      department,
      isActive,
    } = body;

    if (!name || !actionType || !description) {
      return NextResponse.json({ error: "Name, description, and action type are required" }, { status: 400 });
    }

    const action = await prisma.quickAction.create({
      data: {
        name,
        description,
        actionType,
        config: config ? (typeof config === "string" ? config : JSON.stringify(config)) : "{}",
        department: department || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ action });
  } catch (error) {
    console.error("Failed to create quick action:", error);
    return NextResponse.json({ error: "Failed to create quick action" }, { status: 500 });
  }
}
