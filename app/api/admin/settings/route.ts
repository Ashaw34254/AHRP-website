import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/settings - Get all settings grouped by category
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category ? { category } : {};

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { key: "asc" },
      ],
    });

    // Group settings by category
    const grouped = settings.reduce((acc: Record<string, any[]>, setting: typeof settings[number]) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      
      // Parse value based on dataType
      let parsedValue: unknown = setting.value;
      try {
        if (setting.dataType === "boolean") {
          parsedValue = setting.value === "true";
        } else if (setting.dataType === "number") {
          parsedValue = parseFloat(setting.value);
        } else if (setting.dataType === "json") {
          parsedValue = JSON.parse(setting.value);
        }
      } catch (e) {
        console.error(`Error parsing setting ${setting.key}:`, e);
      }

      acc[setting.category].push({
        ...setting,
        parsedValue,
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      settings: grouped,
      allSettings: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update a setting
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { key, value, dataType } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Setting key is required" },
        { status: 400 }
      );
    }

    // Convert value to string for storage
    let stringValue = String(value);
    if (dataType === "json" && typeof value === "object") {
      stringValue = JSON.stringify(value);
    }

    const setting = await prisma.setting.update({
      where: { key },
      data: {
        value: stringValue,
        dataType: dataType || "string",
      },
    });

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Create a new setting
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category, key, value, description, dataType } = body;

    if (!category || !key) {
      return NextResponse.json(
        { success: false, message: "Category and key are required" },
        { status: 400 }
      );
    }

    // Convert value to string for storage
    let stringValue = String(value || "");
    if (dataType === "json" && typeof value === "object") {
      stringValue = JSON.stringify(value);
    }

    const setting = await prisma.setting.create({
      data: {
        category,
        key,
        value: stringValue,
        description: description || null,
        dataType: dataType || "string",
      },
    });

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error: any) {
    console.error("Error creating setting:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Setting key already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/settings - Delete a setting
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Setting key is required" },
        { status: 400 }
      );
    }

    await prisma.setting.delete({
      where: { key },
    });

    return NextResponse.json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
