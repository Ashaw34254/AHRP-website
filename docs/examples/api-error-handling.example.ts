/**
 * Example API Route with Error Handling
 * 
 * This demonstrates best practices for error handling in Next.js API routes
 * for the Aurora Horizon RP project.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logApiError, logDatabaseError } from "@/lib/error-logger";

export async function GET(request: NextRequest) {
  try {
    // Example: Fetch data from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ users });

  } catch (error) {
    // Log database errors with context
    logDatabaseError(
      error as Error,
      'findMany',
      'User'
    );

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    if (!body.email || !body.name) {
      const validationError = new Error("Missing required fields: email and name");
      logApiError(
        validationError,
        '/api/example',
        'POST',
        400
      );
      
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });

    return NextResponse.json({ user }, { status: 201 });

  } catch (error: any) {
    // Check for Prisma-specific errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      logDatabaseError(
        error as Error,
        'create',
        'User'
      );

      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generic error logging
    logApiError(
      error as Error,
      '/api/example',
      'POST',
      500
    );

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new Error("Missing user ID");
    }

    const body = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ user });

  } catch (error: any) {
    // Check for "Record not found" error
    if (error.code === 'P2025') {
      logDatabaseError(
        error as Error,
        'update',
        'User'
      );

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    logApiError(
      error as Error,
      '/api/example',
      'PATCH',
      500
    );

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * Example with external API call
 */
export async function externalApiExample() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();

  } catch (error: any) {
    // Log network errors with additional context
    logApiError(
      error as Error,
      'https://api.example.com/data',
      'GET',
      error.response?.status
    );

    throw error; // Re-throw to handle in calling function
  }
}

/**
 * Example with custom error context
 */
export async function complexOperationExample(userId: string) {
  try {
    // Multiple operations that might fail
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { user };

  } catch (error) {
    // Log with detailed context
    logDatabaseError(
      error as Error,
      'complexOperation',
      'User/Post'
    );

    throw error;
  }
}
