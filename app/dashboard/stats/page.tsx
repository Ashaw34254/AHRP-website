"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Chip, Progress, Tabs, Tab, Skeleton } from "@heroui/react";
import { TrendingUp, Award, Clock, Target, Users, Zap, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";

interface Stats {
  totalMinutes: number;
  monthlyMinutes: Record<string, number>;
  arrestsMade: number;
  callsResponded: number;
  patientsTreated: number;
  firesExtinguished: number;
  commendations: number;
  warnings: number;
  loginStreak: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  image: string | null;
  hours: number;
  arrests: number;
  callsResponded: number;
  isCurrentUser: boolean;
}

interface Achievement {
  id: string;
  name: string;
  progress: number;
  max: number;
  unlocked: boolean;
  icon: string;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      setStats(data.stats);
      setLeaderboard(data.leaderboard);
      setAchievements(data.achievements);
    } catch (error) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const totalHours = stats ? Math.floor(stats.totalMinutes / 60) : 0;
  const totalMinutes = stats ? stats.totalMinutes % 60 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Statistics & Analytics
          </h1>
          <p className="text-gray-400 mt-1">Track your performance and progress</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/50">
            <CardBody className="text-center p-6">
              <Clock className="w-10 h-10 mx-auto mb-2 text-indigo-400" />
              {loading ? (
                <Skeleton className="h-9 w-24 mx-auto mb-1 rounded-lg" />
              ) : (
                <div className="text-3xl font-bold text-white">{totalHours}h {totalMinutes}m</div>
              )}
              <p className="text-sm text-gray-400">Total Playtime</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800/50">
            <CardBody className="text-center p-6">
              <Target className="w-10 h-10 mx-auto mb-2 text-blue-400" />
              {loading ? (
                <Skeleton className="h-9 w-16 mx-auto mb-1 rounded-lg" />
              ) : (
                <div className="text-3xl font-bold text-white">{stats?.arrestsMade ?? 0}</div>
              )}
              <p className="text-sm text-gray-400">Arrests Made</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-800/50">
            <CardBody className="text-center p-6">
              <Zap className="w-10 h-10 mx-auto mb-2 text-green-400" />
              {loading ? (
                <Skeleton className="h-9 w-16 mx-auto mb-1 rounded-lg" />
              ) : (
                <div className="text-3xl font-bold text-white">{stats?.callsResponded ?? 0}</div>
              )}
              <p className="text-sm text-gray-400">Calls Responded</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-800/50">
            <CardBody className="text-center p-6">
              <Award className="w-10 h-10 mx-auto mb-2 text-yellow-400" />
              {loading ? (
                <Skeleton className="h-9 w-16 mx-auto mb-1 rounded-lg" />
              ) : (
                <div className="text-3xl font-bold text-white">{stats?.commendations ?? 0}</div>
              )}
              <p className="text-sm text-gray-400">Commendations</p>
            </CardBody>
          </Card>
        </div>

        <Tabs size="lg" color="primary">
          <Tab
            key="achievements"
            title={
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Achievements</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-6">
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </CardBody>
                  </Card>
                ))
              ) : (
                achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`border ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-800/50' : 'bg-gray-900/50 border-gray-800'}`}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                            {achievement.unlocked && (
                              <Chip color="warning" size="sm" variant="flat">Unlocked</Chip>
                            )}
                          </div>
                          <Progress
                            value={Math.min(achievement.progress, achievement.max)}
                            maxValue={achievement.max}
                            color={achievement.unlocked ? "warning" : "default"}
                            size="sm"
                            className="mb-2"
                          />
                          <p className="text-sm text-gray-400">
                            {achievement.progress} / {achievement.max}
                            {!achievement.unlocked && ` (${Math.max(0, achievement.max - achievement.progress)} to go)`}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>

          <Tab
            key="leaderboard"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Leaderboard</span>
              </div>
            }
          >
            <Card className="bg-gray-900/50 border border-gray-800 mt-6">
              <CardHeader>
                <h2 className="text-xl font-bold text-white">Top Members - By Playtime</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))
                  ) : leaderboard.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No data yet. Start playing to appear on the leaderboard!</p>
                  ) : (
                    leaderboard.map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg ${player.isCurrentUser ? 'bg-indigo-900/30 border-2 border-indigo-700' : 'bg-gray-800/50'}`}
                      >
                        <div className={`text-2xl font-bold ${
                          player.rank === 1 ? 'text-yellow-400' :
                          player.rank === 2 ? 'text-gray-300' :
                          player.rank === 3 ? 'text-orange-400' :
                          'text-gray-500'
                        }`}>
                          #{player.rank}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{player.name}</h4>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>{player.hours}h played</span>
                            <span>{player.arrests} arrests</span>
                            <span>{player.callsResponded} calls</span>
                          </div>
                        </div>
                        {player.rank <= 3 && (
                          <div className="text-2xl">
                            {player.rank === 1 && "🥇"}
                            {player.rank === 2 && "🥈"}
                            {player.rank === 3 && "🥉"}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="activity"
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Activity</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h3 className="font-bold text-white">Monthly Playtime</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))
                  ) : Object.keys(stats?.monthlyMinutes ?? {}).length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No monthly data yet</p>
                  ) : (
                    Object.entries(stats!.monthlyMinutes)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 6)
                      .map(([month, minutes]) => {
                        const hours = Math.floor(minutes / 60);
                        const maxMinutes = Math.max(...Object.values(stats!.monthlyMinutes), 1);
                        const percentage = (minutes / maxMinutes) * 100;
                        return (
                          <div key={month}>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-400">{month}</span>
                              <span className="text-white font-bold">{hours}h {minutes % 60}m</span>
                            </div>
                            <Progress value={percentage} color="primary" size="sm" />
                          </div>
                        );
                      })
                  )}
                </CardBody>
              </Card>

              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h3 className="font-bold text-white">Current Streaks</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {loading ? (
                    <Skeleton className="h-32 w-full rounded-lg" />
                  ) : (
                    <>
                      <div className="text-center py-6">
                        <div className="text-5xl mb-2">🔥</div>
                        <div className="text-4xl font-bold text-orange-400 mb-1">
                          {stats?.loginStreak ?? 0}
                        </div>
                        <p className="text-gray-400">Day Login Streak</p>
                      </div>
                      <div className="flex items-center justify-around pt-4 border-t border-gray-800">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{stats?.commendations ?? 0}</div>
                          <p className="text-xs text-gray-400">Commendations</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{stats?.warnings ?? 0}</div>
                          <p className="text-xs text-gray-400">Warnings</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
