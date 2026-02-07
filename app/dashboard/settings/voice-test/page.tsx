'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardBody, Button, Select, SelectItem, Slider, Chip } from '@heroui/react';
import { useCADVoiceAlerts } from '@/lib/use-voice-alerts';
import { useVoice } from '@/lib/voice-context';
import { useState } from 'react';
import { Volume2, AlertTriangle, Phone, Activity, Bell, Radio } from 'lucide-react';

export default function VoiceTestingPage() {
  const voiceAlerts = useCADVoiceAlerts();
  const { config, updateConfig } = useVoice();
  const [selectedScenario, setSelectedScenario] = useState('basic');
  const [testPriority, setTestPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal');
  const [testDepartment, setTestDepartment] = useState<'POLICE' | 'FIRE' | 'EMS'>('POLICE');

  const basicTests = [
    {
      name: 'Info Alert',
      icon: <Bell className="w-5 h-5" />,
      color: 'primary',
      action: () => voiceAlerts.speak('This is a basic information alert for testing purposes.', { priority: 'normal', type: 'notification' }),
    },
    {
      name: 'High Priority Call',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'warning',
      action: () => voiceAlerts.announceNewCall({
        callNumber: 'TEST-001',
        type: '10-50 Traffic Accident',
        priority: 'HIGH',
        location: 'Main Street and 5th Avenue',
        department: testDepartment,
      }),
    },
    {
      name: 'Critical Emergency',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'danger',
      action: () => voiceAlerts.announceNewCall({
        callNumber: 'TEST-002',
        type: '10-999 Officer Down',
        priority: 'CRITICAL',
        location: 'Grove Street Warehouse',
        department: 'POLICE',
      }),
    },
    {
      name: 'BOLO Hit',
      icon: <Radio className="w-5 h-5" />,
      color: 'warning',
      action: () => voiceAlerts.announceBOLOHit({
        plate: 'ABC123',
        vehicle: 'Blue Toyota Camry',
        location: 'Downtown District',
      }),
    },
    {
      name: 'Panic Button',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'danger',
      action: () => voiceAlerts.announcePanicButton({
        callsign: 'A-247',
        location: 'Industrial Park Sector 9',
      }),
    },
    {
      name: 'Backup Request',
      icon: <Phone className="w-5 h-5" />,
      color: 'warning',
      action: () => voiceAlerts.announceBackupRequested({
        callsign: 'B-105',
        location: 'Highway 1 Mile Marker 23',
      }),
    },
  ];

  const departmentTests = {
    POLICE: [
      () => voiceAlerts.announceNewCall({ callNumber: 'P-001', type: '10-31 Burglary in Progress', priority: 'HIGH', location: 'Main Street Bank', department: 'POLICE' }),
      () => voiceAlerts.announceUnitAvailable('A-247'),
      () => voiceAlerts.announceBackupRequested({ callsign: 'B-105', location: 'Downtown' }),
    ],
    FIRE: [
      () => voiceAlerts.announceFireEmergency('Industrial Complex', 'Structure Fire', '3-alarm'),
      () => voiceAlerts.announceHazmatAlert('Chemical Plant', 'Unknown substance'),
    ],
    EMS: [
      () => voiceAlerts.announceMedicalEmergency('City Park', 'Cardiac Arrest'),
      () => voiceAlerts.announceAmbulanceRequested('E-001', 'Shopping Mall'),
    ],
  };

  const statusTests = [
    { name: 'Unit Available', action: () => voiceAlerts.announceUnitAvailable('Test-1') },
    { name: 'Unit Busy', action: () => voiceAlerts.announceUnitBusy('Test-1', 'On Call') },
    { name: 'Unit En Route', action: () => voiceAlerts.announceUnitEnRoute('Test-1', 'Main St', '5') },
    { name: 'Unit On Scene', action: () => voiceAlerts.announceUnitOnScene('Test-1', 'TEST-001') },
    { name: 'Unit Offline', action: () => voiceAlerts.announceUnitOffline('Test-1') },
  ];

  const adminTests = [
    { name: 'Shift Start', action: () => voiceAlerts.announceShiftStart('Officer Smith', 'Day') },
    { name: 'Shift End Warning', action: () => voiceAlerts.announceShiftEnd('Officer Smith', '30 minutes') },
    { name: 'System Update', action: () => voiceAlerts.announceSystemUpdate('15') },
    { name: 'Training Available', action: () => voiceAlerts.announceTrainingAvailable('Active Shooter Response') },
    { name: 'Warrants Update', action: () => voiceAlerts.announceWarrantsUpdate('7') },
  ];

  const loadTestSequence = () => {
    // Rapid-fire sequence to test queue management
    const alerts = [
      () => voiceAlerts.speak('Load test alert 1', { priority: 'low', type: 'notification' }),
      () => voiceAlerts.speak('Load test alert 2', { priority: 'normal', type: 'notification' }),
      () => voiceAlerts.speak('Load test alert 3', { priority: 'high', type: 'call' }),
      () => voiceAlerts.speak('Load test alert 4', { priority: 'normal', type: 'notification' }),
      () => voiceAlerts.speak('Load test alert 5', { priority: 'low', type: 'notification' }),
      () => voiceAlerts.speak('Critical interrupt test', { priority: 'critical', type: 'panic' }),
    ];
    
    alerts.forEach((alert, i) => setTimeout(alert, i * 500));
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Voice Alert Testing Suite</h1>
          <p className="text-gray-400">Test all voice alert features and scenarios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Department Selector */}
          <Card>
            <CardBody>
              <Select
                label="Test Department"
                selectedKeys={[testDepartment]}
                onChange={(e) => setTestDepartment(e.target.value as any)}
              >
                <SelectItem key="POLICE">Police</SelectItem>
                <SelectItem key="FIRE">Fire</SelectItem>
                <SelectItem key="EMS">EMS</SelectItem>
              </Select>
            </CardBody>
          </Card>

          {/* Priority Selector */}
          <Card>
            <CardBody>
              <Select
                label="Test Priority"
                selectedKeys={[testPriority]}
                onChange={(e) => setTestPriority(e.target.value as any)}
              >
                <SelectItem key="low">Low</SelectItem>
                <SelectItem key="normal">Normal</SelectItem>
                <SelectItem key="high">High</SelectItem>
                <SelectItem key="critical">Critical</SelectItem>
              </Select>
            </CardBody>
          </Card>

          {/* Volume Control */}
          <Card>
            <CardBody>
              <label className="block text-sm font-medium mb-2">
                Test Volume: {Math.round(config.volume * 100)}%
              </label>
              <Slider
                value={config.volume}
                onChange={(value) => updateConfig({ volume: value as number })}
                min={0}
                max={1}
                step={0.1}
                color="primary"
              />
            </CardBody>
          </Card>
        </div>

        {/* Basic Tests */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Basic Alert Tests</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {basicTests.map((test) => (
                <Button
                  key={test.name}
                  color={test.color as any}
                  variant="flat"
                  startContent={test.icon}
                  onPress={test.action}
                  fullWidth
                >
                  {test.name}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Department-Specific Tests */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Department Tests: {testDepartment}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {departmentTests[testDepartment].map((test, i) => (
                <Button
                  key={i}
                  color="primary"
                  variant="flat"
                  onPress={test}
                  fullWidth
                >
                  Test {i + 1}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Status Change Tests */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Unit Status Tests</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {statusTests.map((test) => (
                <Button
                  key={test.name}
                  color="secondary"
                  variant="flat"
                  onPress={test.action}
                  size="sm"
                  fullWidth
                >
                  {test.name}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Admin Tests */}
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Administrative Alerts</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {adminTests.map((test) => (
                <Button
                  key={test.name}
                  color="default"
                  variant="flat"
                  onPress={test.action}
                  size="sm"
                  fullWidth
                >
                  {test.name}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Load Testing */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Load & Stress Testing</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                color="warning"
                variant="flat"
                onPress={loadTestSequence}
                fullWidth
              >
                Run Load Test (6 rapid alerts)
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                      voiceAlerts.speak(`Stress test alert ${i + 1}`, {
                        priority: i % 2 === 0 ? 'high' : 'normal',
                        type: 'notification',
                      });
                    }, i * 200);
                  }
                }}
                fullWidth
              >
                Run Stress Test (10 alerts)
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
