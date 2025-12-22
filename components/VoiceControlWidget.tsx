'use client';

import { Button, Chip } from '@nextui-org/react';
import { useVoice } from '@/lib/voice-context';
import { useState } from 'react';

export default function VoiceControlWidget() {
  const { isEnabled, toggle, isSpeaking, stop, testVoice } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl p-4 shadow-2xl min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔊</span>
              <span className="font-semibold">Voice Alerts</span>
            </div>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => setIsExpanded(false)}
            >
              ✕
            </Button>
          </div>

          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              <Chip
                size="sm"
                color={isEnabled ? 'success' : 'default'}
                variant="flat"
              >
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Chip>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" />
                  <div className="w-1 h-4 bg-blue-500 rounded animate-pulse delay-75" />
                  <div className="w-1 h-4 bg-blue-500 rounded animate-pulse delay-150" />
                </div>
                <span className="text-sm text-blue-400">Speaking...</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                size="sm"
                color={isEnabled ? 'danger' : 'success'}
                variant="flat"
                onPress={toggle}
                fullWidth
              >
                {isEnabled ? 'Disable' : 'Enable'}
              </Button>
              {isSpeaking && (
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  onPress={stop}
                  fullWidth
                >
                  Stop
                </Button>
              )}
            </div>

            <Button
              size="sm"
              color="primary"
              variant="bordered"
              onPress={testVoice}
              isDisabled={!isEnabled || isSpeaking}
              fullWidth
            >
              Test Voice
            </Button>
          </div>
        </div>
      ) : (
        <Button
          isIconOnly
          color={isEnabled ? 'primary' : 'default'}
          variant={isSpeaking ? 'shadow' : 'flat'}
          className="w-14 h-14 text-2xl shadow-lg"
          onPress={() => setIsExpanded(true)}
        >
          {isSpeaking ? (
            <span className="animate-pulse">🔊</span>
          ) : isEnabled ? (
            '🔊'
          ) : (
            '🔇'
          )}
        </Button>
      )}
    </div>
  );
}
