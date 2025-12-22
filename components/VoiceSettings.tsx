'use client';

import { Card, CardBody, CardHeader, Switch, Select, SelectItem, Slider, Button, Divider, Tabs, Tab, Input, Chip } from '@nextui-org/react';
import { useVoice, VoiceTemplates } from '@/lib/voice-context';
import { Volume2, Settings, BarChart3, List, Save, Trash2, BookmarkPlus, Keyboard, Shield } from 'lucide-react';
import { useState } from 'react';
import { VoiceQueueViewer } from './VoiceQueueViewer';
import { VoiceAnalyticsViewer } from './VoiceAnalyticsViewer';

const voiceProviders = [
  { value: 'webspeech', label: 'Web Speech API (Free, Built-in)' },
  { value: 'google', label: 'Google Cloud TTS (Requires API Key)' },
  { value: 'azure', label: 'Azure Cognitive Services (Requires API Key)' },
  { value: 'elevenlabs', label: 'ElevenLabs (Premium, Requires API Key)' },
];

const voiceLanguages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-AU', label: 'English (Australia)' },
  { value: 'en-CA', label: 'English (Canada)' },
];

export default function VoiceSettings() {
  const { 
    config, 
    updateConfig, 
    testVoice, 
    isEnabled, 
    toggle, 
    isSpeaking,
    savePreset,
    loadPreset,
    getPresets,
    deletePreset,
    activeDepartment,
    setActiveDepartment,
  } = useVoice();
  const [apiKey, setApiKey] = useState('');
  const [selectedTab, setSelectedTab] = useState('settings');
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState(getPresets());

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardBody className="p-2">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            fullWidth
          >
            <Tab
              key="settings"
              title={
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </div>
              }
            />
            <Tab
              key="queue"
              title={
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Queue
                </div>
              }
            />
            <Tab
              key="analytics"
              title={
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Voice Alert Settings</h3>
            <p className="text-sm text-gray-400">Configure AI text-to-speech alerts</p>
          </div>
          <Switch
            isSelected={isEnabled}
            onValueChange={toggle}
            color="primary"
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Switch>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Provider Selection */}
          <div>
            <Select
              label="Voice Provider"
              selectedKeys={[config.provider]}
              onChange={(e) => updateConfig({ provider: e.target.value as any })}
              isDisabled={!isEnabled}
            >
              {voiceProviders.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </Select>
            <p className="text-xs text-gray-400 mt-2">
              Web Speech API is free and works offline. Premium providers offer higher quality voices.
            </p>
          </div>

          {/* Language Selection */}
          <div>
            <Select
              label="Voice Language"
              selectedKeys={[config.voice]}
              onChange={(e) => updateConfig({ voice: e.target.value })}
              isDisabled={!isEnabled}
            >
              {voiceLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* API Key (for premium providers) */}
          {config.provider !== 'webspeech' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                disabled={!isEnabled}
              />
              <Button
                size="sm"
                color="primary"
                className="mt-2"
                onPress={() => updateConfig({ apiKey })}
                isDisabled={!isEnabled || !apiKey}
              >
                Save API Key
              </Button>
            </div>
          )}

          <Divider />

          {/* Voice Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Speech Rate: {config.rate.toFixed(1)}x
              </label>
              <Slider
                value={config.rate}
                onChange={(value) => updateConfig({ rate: value as number })}
                min={0.5}
                max={2.0}
                step={0.1}
                isDisabled={!isEnabled}
                color="primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pitch: {config.pitch.toFixed(1)}
              </label>
              <Slider
                value={config.pitch}
                onChange={(value) => updateConfig({ pitch: value as number })}
                min={0.5}
                max={2.0}
                step={0.1}
                isDisabled={!isEnabled}
                color="primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Volume: {Math.round(config.volume * 100)}%
              </label>
              <Slider
                value={config.volume}
                onChange={(value) => updateConfig({ volume: value as number })}
                min={0.0}
                max={1.0}
                step={0.1}
                isDisabled={!isEnabled}
                color="primary"
              />
            </div>
          </div>

          <Divider />

          {/* Department Settings */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Department-Specific Settings</h4>
            <p className="text-xs text-gray-400 mb-3">
              Configure different voice settings for each department
            </p>
            <div className="space-y-4">
              <Switch
                isSelected={config.departmentSettings.enabled}
                onValueChange={(value) =>
                  updateConfig({ departmentSettings: { ...config.departmentSettings, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Department-Specific Settings
              </Switch>
              
              {config.departmentSettings.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-700/50">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Active Department Filter
                    </label>
                    <Select
                      size="sm"
                      selectedKeys={activeDepartment ? [activeDepartment] : []}
                      onChange={(e) => setActiveDepartment(e.target.value as any)}
                      placeholder="All Departments"
                    >
                      <SelectItem key="POLICE" value="POLICE">Police</SelectItem>
                      <SelectItem key="FIRE" value="FIRE">Fire</SelectItem>
                      <SelectItem key="EMS" value="EMS">EMS</SelectItem>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Filter voice alerts by department
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Smart Volume */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Smart Volume Control</h4>
            <p className="text-xs text-gray-400 mb-3">
              Automatically adjust volume based on priority and fade alerts smoothly
            </p>
            <div className="space-y-4">
              <Switch
                isSelected={config.smartVolume.enabled}
                onValueChange={(value) =>
                  updateConfig({ smartVolume: { ...config.smartVolume, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Smart Volume
              </Switch>
              
              {config.smartVolume.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-green-700/50">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fade In Duration: {config.smartVolume.fadeIn}ms
                    </label>
                    <Slider
                      value={config.smartVolume.fadeIn}
                      onChange={(value) =>
                        updateConfig({ smartVolume: { ...config.smartVolume, fadeIn: value as number } })
                      }
                      min={0}
                      max={2000}
                      step={100}
                      color="success"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fade Out Duration: {config.smartVolume.fadeOut}ms
                    </label>
                    <Slider
                      value={config.smartVolume.fadeOut}
                      onChange={(value) =>
                        updateConfig({ smartVolume: { ...config.smartVolume, fadeOut: value as number } })
                      }
                      min={0}
                      max={2000}
                      step={100}
                      color="success"
                    />
                  </div>

                  <Switch
                    isSelected={config.smartVolume.priorityScaling}
                    onValueChange={(value) =>
                      updateConfig({ smartVolume: { ...config.smartVolume, priorityScaling: value } })
                    }
                    size="sm"
                  >
                    Priority-Based Volume Scaling
                  </Switch>
                  <p className="text-xs text-gray-500 pl-8">
                    Critical alerts play louder, low priority alerts play softer
                  </p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Control voice alerts with keyboard commands (works globally)
            </p>
            <div className="space-y-4">
              <Switch
                isSelected={config.keyboardShortcuts.enabled}
                onValueChange={(value) =>
                  updateConfig({ keyboardShortcuts: { ...config.keyboardShortcuts, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Keyboard Shortcuts
              </Switch>
              
              {config.keyboardShortcuts.enabled && (
                <div className="space-y-2 pl-4 border-l-2 border-purple-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                      <span className="text-sm text-gray-300">Toggle Mute</span>
                      <Chip size="sm" variant="flat" color="secondary">
                        {config.keyboardShortcuts.toggleMute}
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                      <span className="text-sm text-gray-300">Skip Current</span>
                      <Chip size="sm" variant="flat" color="secondary">
                        {config.keyboardShortcuts.skipCurrent}
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                      <span className="text-sm text-gray-300">Test Voice</span>
                      <Chip size="sm" variant="flat" color="secondary">
                        {config.keyboardShortcuts.testVoice}
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                      <span className="text-sm text-gray-300">Clear Queue</span>
                      <Chip size="sm" variant="flat" color="secondary">
                        {config.keyboardShortcuts.clearQueue}
                      </Chip>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Supervisor Override */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Supervisor Override
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Allow supervisors to force critical announcements that bypass mute
            </p>
            <div className="space-y-4">
              <Switch
                isSelected={config.supervisorOverride.enabled}
                onValueChange={(value) =>
                  updateConfig({ supervisorOverride: { ...config.supervisorOverride, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Supervisor Override
              </Switch>
              
              {config.supervisorOverride.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-yellow-700/50">
                  <Switch
                    isSelected={config.supervisorOverride.bypassMute}
                    onValueChange={(value) =>
                      updateConfig({ supervisorOverride: { ...config.supervisorOverride, bypassMute: value } })
                    }
                    size="sm"
                  >
                    Bypass Mute for Override Alerts
                  </Switch>

                  <Switch
                    isSelected={config.supervisorOverride.forceVolume}
                    onValueChange={(value) =>
                      updateConfig({ supervisorOverride: { ...config.supervisorOverride, forceVolume: value } })
                    }
                    size="sm"
                  >
                    Force Maximum Volume
                  </Switch>
                  <p className="text-xs text-gray-500">
                    Supervisor alerts will play at maximum volume regardless of current settings
                  </p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Presets */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4" />
              Configuration Presets
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Save and load your favorite voice alert configurations
            </p>
            
            {/* Save New Preset */}
            <div className="flex gap-2 mb-3">
              <Input
                size="sm"
                placeholder="Preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              <Button
                size="sm"
                color="primary"
                startContent={<Save className="w-4 h-4" />}
                onPress={() => {
                  if (presetName.trim()) {
                    savePreset(presetName);
                    setPresets(getPresets());
                    setPresetName('');
                  }
                }}
                isDisabled={!presetName.trim()}
              >
                Save
              </Button>
            </div>

            {/* Preset List */}
            {presets.length > 0 ? (
              <div className="space-y-2">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{preset.name}</p>
                      <p className="text-xs text-gray-500">
                        Saved {new Date(preset.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => {
                          loadPreset(preset.id);
                        }}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          deletePreset(preset.id);
                          setPresets(getPresets());
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">
                No presets saved yet. Configure your settings and save a preset.
              </p>
            )}
          </div>

          <Divider />

          {/* Alert Types */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Alert Types</h4>
            <div className="space-y-2">
              <Switch
                isSelected={config.alertTypes.newCalls}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, newCalls: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                New Calls
              </Switch>
              <Switch
                isSelected={config.alertTypes.boloHits}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, boloHits: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                BOLO Hits
              </Switch>
              <Switch
                isSelected={config.alertTypes.panicAlerts}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, panicAlerts: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Panic Alerts
              </Switch>
              <Switch
                isSelected={config.alertTypes.unitStatusChanges}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, unitStatusChanges: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Unit Status Changes
              </Switch>
              <Switch
                isSelected={config.alertTypes.priorityAlerts}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, priorityAlerts: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Priority Alerts (Critical/High only)
              </Switch>
              <Switch
                isSelected={config.alertTypes.backupRequests}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, backupRequests: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Backup Requests
              </Switch>
              <Switch
                isSelected={config.alertTypes.statusChanges}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, statusChanges: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Status Changes
              </Switch>
              <Switch
                isSelected={config.alertTypes.adminAlerts}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, adminAlerts: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Admin Alerts
              </Switch>
              <Switch
                isSelected={config.alertTypes.shiftReminders}
                onValueChange={(value) =>
                  updateConfig({ alertTypes: { ...config.alertTypes, shiftReminders: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Shift Reminders
              </Switch>
            </div>
          </div>

          <Divider />

          {/* Sound Effects */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Sound Effects</h4>
            <div className="space-y-4">
              <Switch
                isSelected={config.soundEffects.enabled}
                onValueChange={(value) =>
                  updateConfig({ soundEffects: { ...config.soundEffects, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Alert Chimes
              </Switch>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sound Volume: {Math.round(config.soundEffects.volume * 100)}%
                </label>
                <Slider
                  value={config.soundEffects.volume}
                  onChange={(value) =>
                    updateConfig({ soundEffects: { ...config.soundEffects, volume: value as number } })
                  }
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  isDisabled={!isEnabled || !config.soundEffects.enabled}
                  color="secondary"
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Voice Profiles */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Voice Profiles</h4>
            <p className="text-xs text-gray-400 mb-3">
              Assign different voices to different alert types for better recognition
            </p>
            <div className="space-y-4">
              <Switch
                isSelected={config.voiceProfiles.enabled}
                onValueChange={(value) =>
                  updateConfig({ voiceProfiles: { ...config.voiceProfiles, enabled: value } })
                }
                isDisabled={!isEnabled}
                size="sm"
              >
                Enable Voice Profiles
              </Switch>
              
              {config.voiceProfiles.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-purple-700/50">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Police/Fire Calls Voice
                    </label>
                    <Select
                      size="sm"
                      selectedKeys={[config.voiceProfiles.callVoice]}
                      onChange={(e) =>
                        updateConfig({
                          voiceProfiles: { ...config.voiceProfiles, callVoice: e.target.value },
                        })
                      }
                      isDisabled={!isEnabled}
                    >
                      <SelectItem key="en-US-Standard-A" value="en-US-Standard-A">
                        Voice A (Male, Authoritative)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-B" value="en-US-Standard-B">
                        Voice B (Male, Deep)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-C" value="en-US-Standard-C">
                        Voice C (Female, Professional)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-D" value="en-US-Standard-D">
                        Voice D (Male, Clear)
                      </SelectItem>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Medical/EMS Calls Voice
                    </label>
                    <Select
                      size="sm"
                      selectedKeys={[config.voiceProfiles.medicalVoice]}
                      onChange={(e) =>
                        updateConfig({
                          voiceProfiles: { ...config.voiceProfiles, medicalVoice: e.target.value },
                        })
                      }
                      isDisabled={!isEnabled}
                    >
                      <SelectItem key="en-US-Standard-A" value="en-US-Standard-A">
                        Voice A (Male, Authoritative)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-B" value="en-US-Standard-B">
                        Voice B (Male, Deep)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-C" value="en-US-Standard-C">
                        Voice C (Female, Professional)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-D" value="en-US-Standard-D">
                        Voice D (Female, Calm)
                      </SelectItem>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Admin/System Alerts Voice
                    </label>
                    <Select
                      size="sm"
                      selectedKeys={[config.voiceProfiles.adminVoice]}
                      onChange={(e) =>
                        updateConfig({
                          voiceProfiles: { ...config.voiceProfiles, adminVoice: e.target.value },
                        })
                      }
                      isDisabled={!isEnabled}
                    >
                      <SelectItem key="en-US-Standard-A" value="en-US-Standard-A">
                        Voice A (Male, Authoritative)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-B" value="en-US-Standard-B">
                        Voice B (Male, Deep)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-C" value="en-US-Standard-C">
                        Voice C (Female, Professional)
                      </SelectItem>
                      <SelectItem key="en-US-Standard-D" value="en-US-Standard-D">
                        Voice D (Neutral)
                      </SelectItem>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Sound Customization */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Sound Alert Customization</h4>
            <p className="text-xs text-gray-400 mb-3">
              Choose which sound plays for each alert type
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">🚨 Panic/Critical</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playCritical();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Urgent siren pattern</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">🚓 BOLO Hit</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="warning"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playBoloHit();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Distinctive pattern</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">⚠️ High Priority</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="warning"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playWarning();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Two-tone alert</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">ℹ️ Normal</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playNotification();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Gentle notification</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">✅ Success</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playSuccess();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Ascending tones</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-300">❌ Error</span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="h-6 min-w-0 px-2"
                      onPress={async () => {
                        const sounds = await import('@/lib/voice-sounds');
                        sounds.getVoiceSounds().playError();
                      }}
                      isDisabled={!isEnabled || !config.soundEffects.enabled}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Descending tones</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Analytics */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Analytics</h4>
            <Switch
              isSelected={config.analytics.enabled}
              onValueChange={(value) =>
                updateConfig({ analytics: { ...config.analytics, enabled: value } })
              }
              isDisabled={!isEnabled}
              size="sm"
            >
              Track Voice Alert Analytics
            </Switch>
          </div>

          <Divider />

          {/* Coming Soon - Version 2.2 Features (Locked) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">🔒 Version 2.2 Features (Locked)</h4>
            
            {/* Voice Commands */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/50 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎤</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Voice Commands</h4>
                  <p className="text-xs text-gray-400">Version 2.2</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                    🔒 Locked
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Control CAD with your voice: "Show active calls", "Create new call", "Assign Unit 1". 
                Hands-free dispatch operations.
              </p>
            </div>

            {/* Custom Templates */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Custom Voice Templates</h4>
                  <p className="text-xs text-gray-400">Version 2.2</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                    🔒 Locked
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Create and save custom voice alert templates with dynamic variables like {'{unit}'}, {'{location}'}, {'{priority}'}.
              </p>
            </div>

            {/* Real-time Transcription */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/50 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Voice-to-Text Logging</h4>
                  <p className="text-xs text-gray-400">Version 2.2</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                    🔒 Locked
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automatic transcription of voice alerts to text logs. Dictate incident reports and call notes.
              </p>
            </div>

            {/* AI Voice Assistant */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-700/50 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">AI CAD Assistant</h4>
                  <p className="text-xs text-gray-400">Version 2.2</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-700 text-gray-400 border border-gray-600">
                    🔒 Locked
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ask questions: "How many active calls?", "Show Unit 5's location". Get smart suggestions and predictive alerts.
              </p>
            </div>
          </div>

          <Divider />

          {/* Test Buttons */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Voice Testing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                color="primary"
                onPress={testVoice}
                isDisabled={!isEnabled || isSpeaking}
                isLoading={isSpeaking}
                fullWidth
              >
                {isSpeaking ? 'Speaking...' : 'Quick Test'}
              </Button>
              <Button
                color="secondary"
                onPress={() => {
                  const testAlerts = [
                    { label: 'New Call', text: VoiceTemplates.newCall('2025-001234', '10-50 Traffic Accident', 'HIGH', 'Main Street and 5th Avenue') },
                    { label: 'BOLO Hit', text: VoiceTemplates.boloHit('ABC123', 'Blue Toyota Camry', 'Downtown District') },
                    { label: 'Panic Button', text: VoiceTemplates.panicButton('A-247', 'Grove Street') },
                  ];
                  const random = testAlerts[Math.floor(Math.random() * testAlerts.length)];
                  updateConfig(config);
                  setTimeout(() => testVoice(), 100);
                }}
                isDisabled={!isEnabled || isSpeaking}
                fullWidth
              >
                Random Alert
              </Button>
              <Button
                color="success"
                variant="flat"
                onPress={() => window.location.href = '/dashboard/settings/voice-test'}
                fullWidth
              >
                Advanced Testing Suite →
              </Button>
            </div>
          </div>

          <Divider />

          {/* Quick Access Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Voice Features Demo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                color="danger"
                variant="flat"
                startContent={<span>🚨</span>}
                onPress={() => window.location.href = '/dashboard/voice-features'}
                fullWidth
              >
                Panic Button Demo
              </Button>
              <Button
                color="warning"
                variant="flat"
                startContent={<span>📻</span>}
                onPress={() => window.location.href = '/dashboard/voice-features'}
                fullWidth
              >
                BOLO Management
              </Button>
              <Button
                color="primary"
                variant="flat"
                startContent={<span>🎤</span>}
                onPress={() => window.location.href = '/dashboard/voice-features'}
                fullWidth
              >
                Voice Notes Timeline
              </Button>
            </div>
          </div>

          <Divider />
        </CardBody>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold">Voice Alert Tips</h4>
        </CardHeader>
        <CardBody>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• <strong>Web Speech API</strong> - Free, works offline, quality varies by browser</li>
            <li>• <strong>Google TTS</strong> - High quality, requires API key ($4 per 1M characters)</li>
            <li>• <strong>Azure TTS</strong> - Premium quality, natural voices, requires subscription</li>
            <li>• <strong>ElevenLabs</strong> - Ultra-realistic AI voices, best quality, paid service</li>
            <li>• Voice alerts work best with headphones for privacy</li>
            <li>• Critical alerts will interrupt lower priority announcements</li>
            <li>• Sound effects play before voice announcements for attention</li>
            <li>• Analytics track alert usage for optimization</li>
          </ul>
        </CardBody>
      </Card>
        </>
      )}

      {/* Queue Tab */}
      {selectedTab === 'queue' && (
        <VoiceQueueViewer />
      )}

      {/* Analytics Tab */}
      {selectedTab === 'analytics' && (
        <VoiceAnalyticsViewer />
      )}
    </div>
  );
}
