'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import VoiceSettings from '@/components/VoiceSettings';

export default function VoiceSettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Voice Alert Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Configure AI text-to-speech alerts for CAD events
          </p>
        </div>
        
        <VoiceSettings />
      </div>
    </DashboardLayout>
  );
}
