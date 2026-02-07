'use client';

import { Button, Chip, Progress } from '@heroui/react';
import { useVoice } from '@/lib/voice-context';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SkipForward, Square, Minimize2, Maximize2, Move } from 'lucide-react';

export default function EnhancedVoiceWidget() {
  const { isEnabled, toggle, isSpeaking, stop, skipCurrent, queue, config } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [audioLevel, setAudioLevel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize position after mount to avoid SSR issues
  useEffect(() => {
    setMounted(true);
    setPosition({
      x: window.innerWidth - 320,
      y: window.innerHeight - 200,
    });
  }, []);

  // Waveform animation when speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isSpeaking]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if clicking on draggable area (not buttons)
    if (target.closest('.drag-handle') && !target.closest('button')) {
      e.preventDefault();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Keyboard shortcuts display
  const shortcuts = config.keyboardShortcuts.enabled ? [
    { key: config.keyboardShortcuts.toggleMute, action: 'Toggle' },
    { key: config.keyboardShortcuts.skipCurrent, action: 'Skip' },
    { key: config.keyboardShortcuts.clearQueue, action: 'Clear' },
  ] : [];

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return null;
  }

  if (isMinimized) {
    return (
      <div
        className="fixed z-50 cursor-pointer"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onPress={() => setIsMinimized(false)}
      >
        <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-full p-3 shadow-2xl hover:scale-110 transition-transform">
          {isEnabled ? (
            isSpeaking ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded"
                      style={{
                        height: `${12 + Math.random() * 8}px`,
                        animation: 'pulse 0.8s ease-in-out infinite',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-blue-400">{queue.length}</span>
              </div>
            ) : (
              <Volume2 className="w-5 h-5 text-green-400" />
            )
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header - Draggable */}
        <div className="drag-handle cursor-move bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEnabled ? (
                <Volume2 className="w-5 h-5 text-purple-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
              <span className="font-semibold text-white">Voice Alerts</span>
              {queue.length > 0 && (
                <Chip size="sm" color="primary" variant="flat">
                  {queue.length}
                </Chip>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onPress={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 min-w-[280px]">
          {/* Status Chip */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Status</span>
            <Chip
              size="sm"
              color={isEnabled ? 'success' : 'default'}
              variant="flat"
            >
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Chip>
          </div>

          {/* Waveform Visualization */}
          {isSpeaking && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-400 font-medium">Speaking...</span>
                <span className="text-xs text-gray-500">{queue.length} in queue</span>
              </div>
              <div className="flex items-center gap-0.5 h-12">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-sm transition-all"
                    style={{
                      height: `${Math.max(4, (Math.sin((i + audioLevel) / 5) + 1) * 20)}px`,
                      opacity: 0.3 + Math.random() * 0.7,
                    }}
                  />
                ))}
              </div>
              <Progress
                size="sm"
                isIndeterminate
                color="primary"
                className="mt-2"
                aria-label="Speaking progress"
              />
            </div>
          )}

          {/* Controls */}
          <div className="space-y-2">
            <Button
              fullWidth
              size="sm"
              color={isEnabled ? 'danger' : 'success'}
              variant="flat"
              startContent={isEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              onPress={toggle}
            >
              {isEnabled ? 'Disable Alerts' : 'Enable Alerts'}
            </Button>

            {isEnabled && (
              <>
                {isSpeaking && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      color="warning"
                      variant="flat"
                      startContent={<SkipForward className="w-4 h-4" />}
                      onPress={skipCurrent}
                    >
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      startContent={<Square className="w-4 h-4" />}
                      onPress={stop}
                    >
                      Stop All
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Keyboard Shortcuts - Expanded */}
          {isExpanded && shortcuts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-1">
                {shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{shortcut.action}</span>
                    <code className="px-2 py-0.5 bg-gray-800 rounded text-purple-400 font-mono">
                      {shortcut.key}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queue Preview - Expanded */}
          {isExpanded && queue.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">
                Next Alerts ({queue.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {queue.slice(0, 3).map((alert, i) => (
                  <div
                    key={alert.id}
                    className="p-2 bg-gray-800/50 rounded border border-gray-700 text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Chip
                        size="sm"
                        color={
                          alert.priority === 'critical' ? 'danger' :
                          alert.priority === 'high' ? 'warning' :
                          'primary'
                        }
                        variant="dot"
                      />
                      <span className="text-gray-400">#{i + 1}</span>
                    </div>
                    <p className="text-gray-300 line-clamp-2">{alert.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

