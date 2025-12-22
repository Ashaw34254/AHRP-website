import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get form configuration
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formType = searchParams.get("type");
    
    if (!formType) {
      return NextResponse.json(
        { success: false, message: "Form type is required" },
        { status: 400 }
      );
    }
    
    const formConfig = await prisma.applicationFormConfig.findUnique({
      where: { name: formType },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });
    
    if (!formConfig) {
      return NextResponse.json(
        { success: false, message: "Form configuration not found" },
        { status: 404 }
      );
    }
    
    // Parse JSON options for each field
    const config = {
      ...formConfig,
      fields: formConfig.fields.map((field) => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : null,
        conditionalLogic: field.conditionalLogic ? JSON.parse(field.conditionalLogic) : null,
      })),
    };
    
    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error fetching form config:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch form configuration" },
      { status: 500 }
    );
  }
}

// Create or update form configuration (Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    const isDev = process.env.NODE_ENV === "development";
    
    // Skip auth check in development mode
    if (!isDev && (!session?.user || session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { name, title, description, isActive, fields } = data;
    
    // Upsert form config
    const formConfig = await prisma.applicationFormConfig.upsert({
      where: { name },
      create: {
        name,
        title,
        description,
        isActive: isActive ?? true,
      },
      update: {
        title,
        description,
        isActive,
      },
    });
    
    // Delete existing fields and create new ones
    await prisma.applicationFormField.deleteMany({
      where: { formConfigId: formConfig.id },
    });
    
    if (fields && fields.length > 0) {
      await prisma.applicationFormField.createMany({
        data: fields.map((field: any, index: number) => ({
          formConfigId: formConfig.id,
          fieldName: field.fieldName,
          label: field.label,
          fieldType: field.fieldType,
          placeholder: field.placeholder,
          helpText: field.helpText,
          required: field.required || false,
          minLength: field.minLength,
          maxLength: field.maxLength,
          pattern: field.pattern,
          options: field.options ? JSON.stringify(field.options) : null,
          conditionalLogic: field.conditionalLogic ? JSON.stringify(field.conditionalLogic) : null,
          order: index,
          width: field.width || "full",
          section: field.section,
        })),
      });
    }
    
    const updatedConfig = await prisma.applicationFormConfig.findUnique({
      where: { id: formConfig.id },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });
    
    // Parse JSON options for each field
    const config = updatedConfig ? {
      ...updatedConfig,
      fields: updatedConfig.fields.map((field) => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : null,
        conditionalLogic: field.conditionalLogic ? JSON.parse(field.conditionalLogic) : null,
      })),
    } : null;
    
    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error saving form config:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save form configuration" },
      { status: 500 }
    );
  }
}
