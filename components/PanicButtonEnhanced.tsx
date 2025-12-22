'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button, Chip, Progress } from '@nextui-org/react';
import { AlertTriangle, Radio, MapPin, Clock, Users } from 'lucide-react';
import { useCADVoiceAlerts } from '@/lib/use-voice-alerts';

interface PanicAlert {
  id: string;
  callsign: string;
  location: string;
  timestamp: number;
  responded: string[];
  distance?: number; // Distance in miles
  countdown?: number; // Seconds until auto-escalation
}

interface PanicButtonEnhancedProps {
  userCallsign?: string;
  userLocation?: string;
}

export default function PanicButtonEnhanced({ userCallsign = 'A-247', userLocation = 'Downtown' }: PanicButtonEnhancedProps) {
  const voiceAlerts = useCADVoiceAlerts();
  const [activePanics, setActivePanics] = useState<PanicAlert[]>([]);
  const [proximityAlerts, setProximityAlerts] = useState<string[]>([]);

  // Simulate panic button press (for testing)
  const triggerPanicButton = useCallback((callsign: string, location: string) => {
    const panicId = `panic-${Date.now()}`;
    
    const newPanic: PanicAlert = {
      id: panicId,
      callsign,
      location,
      timestamp: Date.now(),
      responded: [],
      distance: Math.random() * 5, // Random distance 0-5 miles
      countdown: 300, // 5 minutes to auto-escalate
    };

    setActivePanics((prev) => [...prev, newPanic]);

    // Voice alert with supervisor override
    voiceAlerts.speak(
      `Emergency! Officer needs assistance. Unit ${callsign} activated panic button at ${location}. All available units respond.`,
      {
        priority: 'critical',
        type: 'panic',
        supervisorOverride: true,
        department: 'POLICE',
        canSkip: false,
      }
    );

    // Check proximity for nearby units
    if (newPanic.distance && newPanic.distance < 2) {
      setTimeout(() => {
        setProximityAlerts((prev) => [...prev, panicId]);
        voiceAlerts.speak(
          `Proximity alert. Panic button within 2 miles of your location. Unit ${callsign} at ${location}.`,
          {
            priority: 'high',
            type: 'panic',
            department: 'POLICE',
          }
        );
      }, 2000);
    }
  }, [voiceAlerts]);

  // Handle unit responding to panic
  const respondToPanic = useCallback((panicId: string, respondingUnit: string) => {
    setActivePanics((prev) =>
      prev.map((panic) =>
        panic.id === panicId
          ? { ...panic, responded: [...panic.responded, respondingUnit] }
          : panic
      )
    );

    voiceAlerts.speak(`Unit ${respondingUnit} responding to panic alert.`, {
      priority: 'high',
      type: 'status',
      department: 'POLICE',
    });
  }, [voiceAlerts]);

  // Clear panic alert
  const clearPanic = useCallback((panicId: string) => {
    const panic = activePanics.find((p) => p.id === panicId);
    if (panic) {
      voiceAlerts.speak(`Panic alert cleared for unit ${panic.callsign}. Situation Code 4.`, {
        priority: 'normal',
        type: 'status',
        department: 'POLICE',
      });
    }
    setActivePanics((prev) => prev.filter((p) => p.id !== panicId));
    setProximityAlerts((prev) => prev.filter((id) => id !== panicId));
  }, [activePanics, voiceAlerts]);

  // Countdown and auto-escalation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePanics((prev) =>
        prev.map((panic) => {
          if (!panic.countdown || panic.countdown <= 0) return panic;

          const newCountdown = panic.countdown - 1;

          // Voice countdown at specific intervals
          if (newCountdown === 60) {
            voiceAlerts.speak(
              `Warning. Panic alert for unit ${panic.callsign} has 1 minute until auto-escalation.`,
              {
                priority: 'high',
                type: 'panic',
                department: 'POLICE',
              }
            );
          } else if (newCountdown === 30) {
            voiceAlerts.speak(
              `Critical. Panic alert for unit ${panic.callsign} has 30 seconds until auto-escalation.`,
              {
                priority: 'critical',
                type: 'panic',
                supervisorOverride: true,
                department: 'POLICE',
              }
            );
          } else if (newCountdown === 0) {
            // Auto-escalate
            voiceAlerts.speak(
              `Emergency escalation. No response to panic button for unit ${panic.callsign} at ${panic.location}. Dispatch additional units and notify supervisor immediately.`,
              {
                priority: 'critical',
                type: 'panic',
                supervisorOverride: true,
                department: 'POLICE',
                canSkip: false,
              }
            );
          }

          return { ...panic, countdown: newCountdown };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceAlerts]);

  const formatCountdown = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Test Controls */}
      <Card className="border border-red-900/50 bg-gradient-to-br from-red-950/20 to-black">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Panic Button System</h3>
              <p className="text-sm text-gray-400">Enhanced with proximity alerts and auto-escalation</p>
            </div>
            <Button
              color="danger"
              size="lg"
              startContent={<AlertTriangle className="w-5 h-5" />}
              onPress={() => triggerPanicButton(userCallsign, userLocation)}
            >
              Test Panic Button
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Active Panic Alerts */}
      {activePanics.length > 0 && (
        <Card className="border border-red-500/50">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Active Panic Alerts ({activePanics.length})</h3>
            </div>

            <div className="space-y-3">
              {activePanics.map((panic) => {
                const isProximityAlert = proximityAlerts.includes(panic.id);
                const countdownPercent = panic.countdown ? (panic.countdown / 300) * 100 : 0;
                const isUrgent = panic.countdown && panic.countdown < 60;

                return (
                  <Card key={panic.id} className={`border ${isProximityAlert ? 'border-yellow-500/50 bg-yellow-950/20' : 'border-red-500/50 bg-red-950/20'}`}>
                    <CardBody>
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Radio className="w-4 h-4 text-red-500" />
                              <span className="font-bold text-white">Unit {panic.callsign}</span>
                              {isProximityAlert && (
                                <Chip size="sm" color="warning" variant="flat">
                                  NEARBY
                                </Chip>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {panic.location}
                              </span>
                              {panic.distance && (
                                <span className="flex items-center gap-1">
                                  {panic.distance.toFixed(1)} mi away
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(panic.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            onPress={() => clearPanic(panic.id)}
                          >
                            Code 4
                          </Button>
                        </div>

                        {/* Countdown Progress */}
                        {panic.countdown !== undefined && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className={isUrgent ? 'text-red-500 font-bold' : 'text-gray-400'}>
                                Auto-escalation in: {formatCountdown(panic.countdown)}
                              </span>
                              <span className="text-gray-400">{Math.round(countdownPercent)}%</span>
                            </div>
                            <Progress
                              value={countdownPercent}
                              color={isUrgent ? 'danger' : 'warning'}
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Responding Units */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              Responding Units: {panic.responded.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {panic.responded.map((unit) => (
                              <Chip key={unit} size="sm" color="primary" variant="flat">
                                {unit}
                              </Chip>
                            ))}
                            {panic.responded.length === 0 && (
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onPress={() => respondToPanic(panic.id, userCallsign)}
                              >
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Info Card */}
      {activePanics.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No active panic alerts</p>
              <p className="text-sm text-gray-500 mt-1">
                Click "Test Panic Button" to simulate an emergency alert
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
