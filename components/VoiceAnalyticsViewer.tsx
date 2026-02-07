'use client';

import { Card, CardBody, Chip } from '@heroui/react';
import { BarChart3, Clock, CheckCircle } from 'lucide-react';
import { useVoice } from '@/lib/voice-context';

/**
 * Voice Analytics Viewer Component
 * Displays voice alert usage statistics and history
 */
export function VoiceAnalyticsViewer() {
  const { getAnalytics } = useVoice();
  const analytics = getAnalytics();

  const totalAlerts = analytics.length;
  const avgDuration = analytics.length > 0
    ? Math.round(analytics.reduce((sum, a) => sum + a.duration, 0) / analytics.length / 1000)
    : 0;
  
  const acknowledgedCount = analytics.filter(a => a.acknowledged).length;
  const acknowledgedRate = totalAlerts > 0
    ? Math.round((acknowledgedCount / totalAlerts) * 100)
    : 0;

  // Count by type
  const typeCounts = analytics.reduce((acc, alert) => {
    acc[alert.alertType] = (acc[alert.alertType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'panic':
        return 'danger';
      case 'bolo':
        return 'warning';
      case 'call':
        return 'primary';
      case 'status':
        return 'secondary';
      case 'admin':
        return 'default';
      default:
        return 'default';
    }
  };

  if (analytics.length === 0) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="text-center py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">No analytics data yet</p>
          <p className="text-xs text-gray-500 mt-2">
            Voice alerts will be tracked here once enabled
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/50">
          <CardBody className="text-center py-6">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-3xl font-bold text-white mb-1">{totalAlerts}</p>
            <p className="text-sm text-gray-400">Total Alerts</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800/50">
          <CardBody className="text-center py-6">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-bold text-white mb-1">{avgDuration}s</p>
            <p className="text-sm text-gray-400">Avg Duration</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-800/50">
          <CardBody className="text-center py-6">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-3xl font-bold text-white mb-1">{acknowledgedRate}%</p>
            <p className="text-sm text-gray-400">Acknowledged</p>
          </CardBody>
        </Card>
      </div>

      {/* Alert Types */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <h3 className="text-lg font-bold text-white mb-4">Alert Types</h3>
          
          <div className="space-y-3">
            {topTypes.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Chip
                    size="sm"
                    color={getTypeColor(type)}
                    variant="flat"
                  >
                    {type}
                  </Chip>
                  
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{
                        width: `${(count / totalAlerts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                
                <span className="text-sm font-bold text-white ml-3">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics.slice(-10).reverse().map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Chip
                    size="sm"
                    color={getTypeColor(alert.alertType)}
                    variant="flat"
                  >
                    {alert.alertType}
                  </Chip>
                  
                  <span className="text-sm text-gray-400">
                    {formatDate(alert.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {Math.round(alert.duration / 1000)}s
                  </span>
                  
                  {alert.acknowledged && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
