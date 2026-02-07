'use client';

import { Card, CardBody, Button, Chip, Progress } from '@heroui/react';
import { Volume2, X, SkipForward, Trash2, Clock } from 'lucide-react';
import { useVoice } from '@/lib/voice-context';

/**
 * Voice Queue Viewer Component
 * Displays current voice alerts in queue with management controls
 */
export function VoiceQueueViewer() {
  const { queue, isSpeaking, skipCurrent, clearQueue } = useVoice();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'normal':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'panic':
        return '🚨';
      case 'bolo':
        return '🚓';
      case 'call':
        return '📞';
      case 'status':
        return '📊';
      case 'admin':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (queue.length === 0) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="text-center py-8">
          <Volume2 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">No voice alerts in queue</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">
              Voice Alert Queue ({queue.length})
            </h3>
          </div>
          
          <div className="flex gap-2">
            {isSpeaking && (
              <Button
                size="sm"
                color="warning"
                variant="flat"
                startContent={<SkipForward className="w-4 h-4" />}
                onPress={skipCurrent}
              >
                Skip
              </Button>
            )}
            
            {queue.length > 0 && (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={clearQueue}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {isSpeaking && (
          <div className="mb-4">
            <Progress
              size="sm"
              isIndeterminate
              color="success"
              className="mb-2"
              aria-label="Speaking..."
            />
            <p className="text-xs text-green-400">Speaking current alert...</p>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {queue.map((alert, index) => (
            <div
              key={alert.id}
              className={`
                p-3 rounded-lg border transition-all
                ${index === 0 && isSpeaking
                  ? 'bg-green-900/20 border-green-700 shadow-lg shadow-green-500/20'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Chip
                      size="sm"
                      color={getPriorityColor(alert.priority)}
                      variant="flat"
                    >
                      {alert.priority.toUpperCase()}
                    </Chip>
                    
                    {alert.department && (
                      <Chip size="sm" variant="bordered" color="primary">
                        {alert.department}
                      </Chip>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(alert.timestamp)}
                    </div>
                    
                    {index === 0 && isSpeaking && (
                      <Chip size="sm" color="success" variant="dot">
                        Speaking
                      </Chip>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {alert.text}
                  </p>
                  
                  {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Object.entries(alert.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-sm font-bold text-purple-400">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
