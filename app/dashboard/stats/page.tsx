"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Chip, Progress, Tabs, Tab } from "@nextui-org/react";
import { TrendingUp, Award, Clock, Target, Users, Zap, Trophy, Star } from "lucide-react";

// Mock statistics data
const mockStats = {
  totalMinutes: 2850, // 47.5 hours
  monthlyMinutes: {
    "2025-12": 1200,
    "2025-11": 900,
    "2025-10": 750,
  },
  arrestsMade: 45,
  callsResponded: 123,
  patientsTreated: 0,
  firesExtinguished: 0,
  commendations: 8,
  warnings: 0,
  loginStreak: 12,
};

const leaderboard = [
  { rank: 1, name: "Officer Smith", department: "POLICE", hours: 156, arrests: 89 },
  { rank: 2, name: "Officer Johnson", department: "POLICE", hours: 142, arrests: 76 },
  { rank: 3, name: "Officer Brown", department: "POLICE", hours: 138, arrests: 71 },
  { rank: 4, name: "Dev User", department: "POLICE", hours: 47, arrests: 45 },
  { rank: 5, name: "Officer Davis", department: "POLICE", hours: 41, arrests: 38 },
];

const achievements = [
  { id: "veteran", name: "Veteran Member", progress: 100, max: 100, unlocked: true, icon: "👑" },
  { id: "active", name: "100 Hours", progress: 47, max: 100, unlocked: false, icon: "⏰" },
  { id: "arrests50", name: "50 Arrests", progress: 45, max: 50, unlocked: false, icon: "🚔" },
  { id: "calls100", name: "100 Calls", progress: 123, max: 100, unlocked: true, icon: "📞" },
  { id: "helpful", name: "Community Helper", progress: 100, max: 100, unlocked: true, icon: "❤️" },
  { id: "streak7", name: "7 Day Streak", progress: 12, max: 7, unlocked: true, icon: "🔥" },
];

export default function StatisticsPage() {
  const totalHours = Math.floor(mockStats.totalMinutes / 60);
  const totalMinutes = mockStats.totalMinutes % 60;

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
              <div className="text-3xl font-bold text-white">{totalHours}h {totalMinutes}m</div>
              <p className="text-sm text-gray-400">Total Playtime</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800/50">
            <CardBody className="text-center p-6">
              <Target className="w-10 h-10 mx-auto mb-2 text-blue-400" />
              <div className="text-3xl font-bold text-white">{mockStats.arrestsMade}</div>
              <p className="text-sm text-gray-400">Arrests Made</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-800/50">
            <CardBody className="text-center p-6">
              <Zap className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <div className="text-3xl font-bold text-white">{mockStats.callsResponded}</div>
              <p className="text-sm text-gray-400">Calls Responded</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-800/50">
            <CardBody className="text-center p-6">
              <Award className="w-10 h-10 mx-auto mb-2 text-yellow-400" />
              <div className="text-3xl font-bold text-white">{mockStats.commendations}</div>
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
              {achievements.map((achievement) => (
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
                          value={achievement.progress} 
                          maxValue={achievement.max}
                          color={achievement.unlocked ? "warning" : "default"}
                          size="sm"
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-400">
                          {achievement.progress} / {achievement.max}
                          {!achievement.unlocked && ` (${achievement.max - achievement.progress} to go)`}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
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
                <h2 className="text-xl font-bold text-white">Police Department - Top Officers</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div 
                      key={player.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${player.name === "Dev User" ? 'bg-indigo-900/30 border-2 border-indigo-700' : 'bg-gray-800/50'}`}
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
                  ))}
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
                  {Object.entries(mockStats.monthlyMinutes).reverse().map(([month, minutes]) => {
                    const hours = Math.floor(minutes / 60);
                    const percentage = (minutes / 1200) * 100; // Relative to max month
                    return (
                      <div key={month}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">{month}</span>
                          <span className="text-white font-bold">{hours}h</span>
                        </div>
                        <Progress value={percentage} color="primary" size="sm" />
                      </div>
                    );
                  })}
                </CardBody>
              </Card>

              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h3 className="font-bold text-white">Current Streaks</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="text-center py-6">
                    <div className="text-5xl mb-2">🔥</div>
                    <div className="text-4xl font-bold text-orange-400 mb-1">
                      {mockStats.loginStreak}
                    </div>
                    <p className="text-gray-400">Day Login Streak</p>
                  </div>
                  <div className="flex items-center justify-around pt-4 border-t border-gray-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{mockStats.commendations}</div>
                      <p className="text-xs text-gray-400">Commendations</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{mockStats.warnings}</div>
                      <p className="text-xs text-gray-400">Warnings</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
