import { NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id!;

    // Get or create user statistics
    let stats = await prisma.userStatistics.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await prisma.userStatistics.create({
        data: { userId },
      });
    }

    // Parse monthly minutes from JSON
    let monthlyMinutes: Record<string, number> = {};
    if (stats.monthlyMinutes) {
      try {
        monthlyMinutes = JSON.parse(stats.monthlyMinutes);
      } catch {
        monthlyMinutes = {};
      }
    }

    // Get leaderboard - top users by total minutes
    const leaderboardData = await prisma.userStatistics.findMany({
      orderBy: { totalMinutes: "desc" },
      take: 10,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    const leaderboard = leaderboardData.map((entry, index) => ({
      rank: index + 1,
      name: entry.user.name || "Unknown",
      image: entry.user.image,
      hours: Math.floor(entry.totalMinutes / 60),
      arrests: entry.arrestsMade,
      callsResponded: entry.callsResponded,
      isCurrentUser: entry.userId === userId,
    }));

    // Define achievements based on real data
    const achievements = [
      {
        id: "hours10",
        name: "10 Hours",
        progress: Math.floor(stats.totalMinutes / 60),
        max: 10,
        unlocked: stats.totalMinutes >= 600,
        icon: "⏰",
      },
      {
        id: "hours50",
        name: "50 Hours",
        progress: Math.floor(stats.totalMinutes / 60),
        max: 50,
        unlocked: stats.totalMinutes >= 3000,
        icon: "⏰",
      },
      {
        id: "hours100",
        name: "100 Hours",
        progress: Math.floor(stats.totalMinutes / 60),
        max: 100,
        unlocked: stats.totalMinutes >= 6000,
        icon: "👑",
      },
      {
        id: "arrests10",
        name: "10 Arrests",
        progress: stats.arrestsMade,
        max: 10,
        unlocked: stats.arrestsMade >= 10,
        icon: "🚔",
      },
      {
        id: "arrests50",
        name: "50 Arrests",
        progress: stats.arrestsMade,
        max: 50,
        unlocked: stats.arrestsMade >= 50,
        icon: "🚔",
      },
      {
        id: "calls50",
        name: "50 Calls Responded",
        progress: stats.callsResponded,
        max: 50,
        unlocked: stats.callsResponded >= 50,
        icon: "📞",
      },
      {
        id: "calls100",
        name: "100 Calls Responded",
        progress: stats.callsResponded,
        max: 100,
        unlocked: stats.callsResponded >= 100,
        icon: "📞",
      },
      {
        id: "streak7",
        name: "7 Day Streak",
        progress: stats.loginStreak,
        max: 7,
        unlocked: stats.loginStreak >= 7,
        icon: "🔥",
      },
      {
        id: "commend5",
        name: "5 Commendations",
        progress: stats.commendations,
        max: 5,
        unlocked: stats.commendations >= 5,
        icon: "⭐",
      },
    ];

    return NextResponse.json({
      stats: {
        totalMinutes: stats.totalMinutes,
        monthlyMinutes,
        arrestsMade: stats.arrestsMade,
        callsResponded: stats.callsResponded,
        patientsTreated: stats.patientsTreated,
        firesExtinguished: stats.firesExtinguished,
        commendations: stats.commendations,
        warnings: stats.warnings,
        loginStreak: stats.loginStreak,
      },
      leaderboard,
      achievements,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
