'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button, Chip, Input, Select, SelectItem } from '@heroui/react';
import { Radio, Search, Clock, AlertTriangle, Car, User } from 'lucide-react';
import { useCADVoiceAlerts } from '@/lib/use-voice-alerts';

interface BOLO {
  id: string;
  type: 'vehicle' | 'person';
  plate?: string;
  description: string;
  reason: string;
  issuedBy: string;
  timestamp: number;
  expiresAt: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
  active: boolean;
  hits: number;
}

export default function BOLOManagementIntegration() {
  const voiceAlerts = useCADVoiceAlerts();
  const [bolos, setBolos] = useState<BOLO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'vehicle' | 'person'>('all');

  // Create sample BOLOs
  useEffect(() => {
    const sampleBOLOs: BOLO[] = [
      {
        id: 'bolo-1',
        type: 'vehicle',
        plate: 'ABC123',
        description: 'Blue Toyota Camry, front bumper damage',
        reason: 'Armed Robbery Suspect',
        issuedBy: 'Sgt. Johnson',
        timestamp: Date.now() - 3600000,
        expiresAt: Date.now() + 7200000, // 2 hours from now
        priority: 'high',
        active: true,
        hits: 0,
      },
      {
        id: 'bolo-2',
        type: 'person',
        description: 'White male, 6ft, brown hair, blue jacket',
        reason: 'Shoplifting',
        issuedBy: 'Officer Smith',
        timestamp: Date.now() - 1800000,
        expiresAt: Date.now() + 600000, // 10 minutes from now (will trigger warning)
        priority: 'normal',
        active: true,
        hits: 0,
      },
    ];
    setBolos(sampleBOLOs);
  }, []);

  // Monitor BOLO expirations and send voice warnings
  useEffect(() => {
    const interval = setInterval(() => {
      bolos.forEach((bolo) => {
        if (!bolo.active) return;

        const timeUntilExpiration = bolo.expiresAt - Date.now();
        const minutesUntilExpiration = Math.floor(timeUntilExpiration / 60000);

        // Warn at 15, 10, 5, and 1 minute marks
        if ([15, 10, 5, 1].includes(minutesUntilExpiration)) {
          voiceAlerts.speak(
            `BOLO expiration warning. ${bolo.type === 'vehicle' ? `Vehicle BOLO ${bolo.plate}` : 'Person BOLO'} expires in ${minutesUntilExpiration} ${minutesUntilExpiration === 1 ? 'minute' : 'minutes'}. ${bolo.reason}.`,
            {
              priority: minutesUntilExpiration <= 5 ? 'high' : 'normal',
              type: 'bolo',
              department: 'POLICE',
            }
          );
        }

        // Auto-deactivate expired BOLOs
        if (timeUntilExpiration <= 0) {
          setBolos((prev) =>
            prev.map((b) =>
              b.id === bolo.id
                ? { ...b, active: false }
                : b
            )
          );
          voiceAlerts.speak(
            `BOLO expired. ${bolo.type === 'vehicle' ? `License plate ${bolo.plate}` : 'Person BOLO'} has been deactivated.`,
            {
              priority: 'normal',
              type: 'notification',
              department: 'POLICE',
            }
          );
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [bolos, voiceAlerts]);

  // Simulate BOLO hit
  const triggerBOLOHit = useCallback((bolo: BOLO) => {
    setBolos((prev) =>
      prev.map((b) =>
        b.id === bolo.id
          ? { ...b, hits: b.hits + 1 }
          : b
      )
    );

    if (bolo.type === 'vehicle') {
      voiceAlerts.announceBOLOHit({
        plate: bolo.plate || '',
        vehicle: bolo.description,
        location: 'Downtown District',
      });
    } else {
      voiceAlerts.speak(
        `BOLO Alert. Person matching description spotted. ${bolo.description}. Reason: ${bolo.reason}. Approach with caution.`,
        {
          priority: bolo.priority === 'high' || bolo.priority === 'critical' ? 'high' : 'normal',
          type: 'bolo',
          department: 'POLICE',
        }
      );
    }
  }, [voiceAlerts]);

  // Add new BOLO
  const addBOLO = useCallback((type: 'vehicle' | 'person', description: string, reason: string, priority: BOLO['priority']) => {
    const newBOLO: BOLO = {
      id: `bolo-${Date.now()}`,
      type,
      plate: type === 'vehicle' ? description.split(' ')[0] : undefined,
      description,
      reason,
      issuedBy: 'Current User',
      timestamp: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
      priority,
      active: true,
      hits: 0,
    };

    setBolos((prev) => [...prev, newBOLO]);

    voiceAlerts.speak(
      `New BOLO issued. ${type === 'vehicle' ? `License plate ${newBOLO.plate}` : 'Person'}. ${reason}. All units be advised.`,
      {
        priority: priority === 'high' || priority === 'critical' ? 'high' : 'normal',
        type: 'bolo',
        department: 'POLICE',
      }
    );
  }, [voiceAlerts]);

  // Deactivate BOLO
  const deactivateBOLO = useCallback((boloId: string) => {
    const bolo = bolos.find((b) => b.id === boloId);
    setBolos((prev) =>
      prev.map((b) =>
        b.id === boloId
          ? { ...b, active: false }
          : b
      )
    );

    if (bolo) {
      voiceAlerts.speak(
        `BOLO cancelled. ${bolo.type === 'vehicle' ? `License plate ${bolo.plate}` : 'Person BOLO'} has been deactivated.`,
        {
          priority: 'normal',
          type: 'notification',
          department: 'POLICE',
        }
      );
    }
  }, [bolos, voiceAlerts]);

  const filteredBOLOs = bolos.filter((bolo) => {
    const matchesType = filterType === 'all' || bolo.type === filterType;
    const matchesSearch =
      !searchQuery ||
      bolo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bolo.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bolo.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activeBOLOs = filteredBOLOs.filter((b) => b.active);
  const inactiveBOLOs = filteredBOLOs.filter((b) => !b.active);

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">BOLO Management</h2>
              <p className="text-sm text-gray-400">Voice-integrated Be On Lookout system</p>
            </div>
            <Button
              color="primary"
              startContent={<Radio className="w-4 h-4" />}
              onPress={() => addBOLO('vehicle', 'XYZ789 Black SUV', 'Hit and Run', 'high')}
            >
              Test New BOLO
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Search BOLOs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
            />
            <Select
              label="Filter by Type"
              selectedKeys={[filterType]}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <SelectItem key="all">All Types</SelectItem>
              <SelectItem key="vehicle">Vehicles</SelectItem>
              <SelectItem key="person">Persons</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Active BOLOs */}
      {activeBOLOs.length > 0 && (
        <Card className="border border-yellow-500/50">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-yellow-500 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Active BOLOs ({activeBOLOs.length})</h3>
            </div>

            <div className="space-y-3">
              {activeBOLOs.map((bolo) => {
                const timeRemaining = formatTimeRemaining(bolo.expiresAt);
                const isExpiringSoon = (bolo.expiresAt - Date.now()) < 900000; // Less than 15 minutes

                return (
                  <Card key={bolo.id} className="border border-yellow-500/30 bg-yellow-950/10">
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {bolo.type === 'vehicle' ? (
                              <Car className="w-4 h-4 text-blue-400" />
                            ) : (
                              <User className="w-4 h-4 text-purple-400" />
                            )}
                            <span className="font-bold text-white">
                              {bolo.type === 'vehicle' ? `Vehicle: ${bolo.plate}` : 'Person'}
                            </span>
                            <Chip size="sm" color={bolo.priority === 'high' ? 'danger' : 'warning'} variant="flat">
                              {bolo.priority.toUpperCase()}
                            </Chip>
                            {isExpiringSoon && (
                              <Chip size="sm" color="danger" variant="flat" startContent={<Clock className="w-3 h-3" />}>
                                EXPIRING SOON
                              </Chip>
                            )}
                          </div>
                          <p className="text-sm text-white mb-1">{bolo.description}</p>
                          <p className="text-sm text-yellow-500 mb-2">Reason: {bolo.reason}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Issued by: {bolo.issuedBy}</span>
                            <span>Expires: {timeRemaining}</span>
                            <span>Hits: {bolo.hits}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="warning"
                            variant="flat"
                            onPress={() => triggerBOLOHit(bolo)}
                          >
                            Test Hit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => deactivateBOLO(bolo.id)}
                          >
                            Deactivate
                          </Button>
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

      {/* Inactive BOLOs */}
      {inactiveBOLOs.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold text-white mb-3">Inactive BOLOs ({inactiveBOLOs.length})</h3>
            <div className="space-y-2">
              {inactiveBOLOs.map((bolo) => (
                <div key={bolo.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 opacity-60">
                  <div>
                    <span className="text-sm text-white">
                      {bolo.type === 'vehicle' ? `${bolo.plate} - ` : ''}{bolo.description}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({bolo.reason})</span>
                  </div>
                  <Chip size="sm" variant="flat">INACTIVE</Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {activeBOLOs.length === 0 && inactiveBOLOs.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <Radio className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No BOLOs found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Click "Test New BOLO" to create one'}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
