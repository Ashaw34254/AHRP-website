import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/profile
 * Update user profile information
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getDevSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, discordUsername, discordId, image, bannerImage } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (discordUsername !== undefined) updateData.discordUsername = discordUsername;
    if (discordId !== undefined) updateData.discordId = discordId;
    if (image !== undefined) updateData.image = image;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;

    // In development mode, we'll skip database updates
    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      // In dev mode, just return success with the updated data
      return NextResponse.json({
        ...session.user,
        ...updateData,
      });
    }

    // In production, update the database
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        discordUsername: true,
        discordId: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    // Handle unique constraint violations (e.g., Discord ID already in use)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This Discord account is already linked to another user" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profile
 * Get current user profile information
 */
export async function GET() {
  try {
    const session = await getDevSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";
    
    if (isDev) {
      // In dev mode, return mock session data
      return NextResponse.json(session.user);
    }

    // In production, fetch from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        discordUsername: true,
        discordId: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
