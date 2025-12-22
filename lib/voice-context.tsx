'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getVoiceSounds } from './voice-sounds';

interface VoiceConfig {
  enabled: boolean;
  provider: 'webspeech' | 'google' | 'azure' | 'elevenlabs';
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  apiKey?: string;
  alertTypes: {
    newCalls: boolean;
    boloHits: boolean;
    panicAlerts: boolean;
    unitStatusChanges: boolean;
    priorityAlerts: boolean;
    backupRequests: boolean;
    adminAlerts: boolean;
    statusChanges: boolean;
    shiftReminders: boolean;
  };
  soundEffects: {
    enabled: boolean;
    volume: number;
  };
  voiceProfiles: {
    enabled: boolean;
    callVoice: string;
    medicalVoice: string;
    adminVoice: string;
  };
  customTemplates: Record<string, string>;
  analytics: {
    enabled: boolean;
    logHistory: boolean;
  };
  departmentSettings: {
    enabled: boolean;
    POLICE: Partial<VoiceConfig> | null;
    FIRE: Partial<VoiceConfig> | null;
    EMS: Partial<VoiceConfig> | null;
  };
  smartVolume: {
    enabled: boolean;
    fadeIn: boolean;
    fadeOut: boolean;
    priorityScaling: boolean;
  };
  keyboardShortcuts: {
    enabled: boolean;
    toggleMute: string;
    skipCurrent: string;
    testVoice: string;
    clearQueue: string;
  };
  supervisorOverride: {
    enabled: boolean;
    bypassMute: boolean;
    forceVolume: boolean;
  };
}

interface VoiceAlert {
  id: string;
  text: string;
  type: 'call' | 'bolo' | 'panic' | 'status' | 'admin' | 'notification';
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: number;
  department?: 'POLICE' | 'FIRE' | 'EMS';
  metadata?: Record<string, any>;
  supervisorOverride?: boolean;
  incidentId?: string;
  canSkip?: boolean;
}

interface VoicePreset {
  id: string;
  name: string;
  config: Partial<VoiceConfig>;
  createdAt: number;
}

interface VoiceAnalyticsEntry {
  timestamp: number;
  alertType: string;
  duration: number;
  acknowledged: boolean;
}

interface VoiceContextType {
  config: VoiceConfig;
  updateConfig: (config: Partial<VoiceConfig>) => void;
  speak: (text: string, options?: {
    priority?: 'low' | 'normal' | 'high' | 'critical';
    type?: 'call' | 'bolo' | 'panic' | 'status' | 'admin' | 'notification';
    soundEffect?: boolean;
    department?: 'POLICE' | 'FIRE' | 'EMS';
    metadata?: Record<string, any>;
    supervisorOverride?: boolean;
    incidentId?: string;
  }) => void;
  speakCustom: (templateKey: string, variables: Record<string, string>) => void;
  stop: () => void;
  skipCurrent: () => void;
  clearQueue: () => void;
  isSpeaking: boolean;
  isEnabled: boolean;
  queue: VoiceAlert[];
  toggle: () => void;
  testVoice: () => void;
  getAnalytics: () => VoiceAnalyticsEntry[];
  saveTemplate: (key: string, template: string) => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  getPresets: () => VoicePreset[];
  deletePreset: (id: string) => void;
  activeDepartment: 'POLICE' | 'FIRE' | 'EMS' | null;
  setActiveDepartment: (dept: 'POLICE' | 'FIRE' | 'EMS' | null) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

const defaultConfig: VoiceConfig = {
  enabled: true,
  provider: 'webspeech',
  voice: 'en-US',
  rate: 1.0,
  pitch: 1.0,
  volume: 0.8,
  alertTypes: {
    newCalls: true,
    boloHits: true,
    panicAlerts: true,
    unitStatusChanges: false,
    priorityAlerts: true,
    backupRequests: true,
    adminAlerts: true,
    statusChanges: true,
    shiftReminders: false,
  },
  soundEffects: {
    enabled: true,
    volume: 0.5,
  },
  voiceProfiles: {
    enabled: false,
    callVoice: 'en-US-Standard-A',
    medicalVoice: 'en-US-Standard-C',
    adminVoice: 'en-US-Standard-B',
  },
  customTemplates: {},
  analytics: {
    enabled: true,
    logHistory: true,
  },
  departmentSettings: {
    enabled: false,
    POLICE: null,
    FIRE: null,
    EMS: null,
  },
  smartVolume: {
    enabled: true,
    fadeIn: true,
    fadeOut: true,
    priorityScaling: true,
  },
  keyboardShortcuts: {
    enabled: true,
    toggleMute: 'ctrl+shift+m',
    skipCurrent: 'ctrl+shift+s',
    testVoice: 'ctrl+shift+t',
    clearQueue: 'ctrl+shift+c',
  },
  supervisorOverride: {
    enabled: false,
    bypassMute: true,
    forceVolume: true,
  },
};

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<VoiceConfig>(defaultConfig);
  const [activeDepartment, setActiveDepartment] = useState<'POLICE' | 'FIRE' | 'EMS' | null>(null);
  const [presets, setPresets] = useState<VoicePreset[]>([]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceQueue, setVoiceQueue] = useState<VoiceAlert[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [analytics, setAnalytics] = useState<VoiceAnalyticsEntry[]>([]);
  const [currentAlertStart, setCurrentAlertStart] = useState<number | null>(null);
  const sounds = getVoiceSounds();

  // Load config from localStorage after mount (avoid hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cad-voice-config');
      if (saved) {
        try {
          setConfig({ ...defaultConfig, ...JSON.parse(saved) });
        } catch (error) {
          console.error('[Voice] Failed to load config:', error);
        }
      }
    }
    setMounted(true);
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Save config to localStorage (only after mount to avoid hydration issues)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('cad-voice-config', JSON.stringify(config));
    }
  }, [config, mounted]);

  const updateConfig = useCallback((newConfig: Partial<VoiceConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const speakWebSpeech = useCallback(
    async (text: string, alert: VoiceAlert) => {
      if (!synth || !config.enabled) return;

      // Cancel current speech if critical priority
      if (alert.priority === 'critical' && synth.speaking) {
        synth.cancel();
      }

      // Play sound effect before speaking
      if (config.soundEffects.enabled) {
        sounds.updateConfig({ enabled: true, volume: config.soundEffects.volume });
        if (alert.type === 'panic') {
          await sounds.playPanic();
        } else if (alert.type === 'bolo') {
          await sounds.playBoloHit();
        } else if (alert.priority === 'critical') {
          await sounds.playCritical();
        } else if (alert.priority === 'high') {
          await sounds.playWarning();
        } else {
          await sounds.playNotification();
        }
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Find appropriate voice - use department-specific voice if voice profiles enabled
      let targetVoiceName = config.voice;
      
      if (config.voiceProfiles.enabled && alert.department) {
        // Use department-specific voice based on alert department
        if (alert.department === 'POLICE' || alert.department === 'FIRE') {
          targetVoiceName = config.voiceProfiles.callVoice;
        } else if (alert.department === 'EMS') {
          targetVoiceName = config.voiceProfiles.medicalVoice;
        } else {
          targetVoiceName = config.voiceProfiles.adminVoice;
        }
      }

      const selectedVoice =
        voices.find((v) => v.name === targetVoiceName) ||
        voices.find((v) => v.lang.startsWith(targetVoiceName)) ||
        voices.find((v) => v.name.includes('Google') || v.name.includes('Microsoft')) ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentAlertStart(Date.now());
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        
        // Log analytics
        if (config.analytics.enabled && currentAlertStart) {
          const entry: VoiceAnalyticsEntry = {
            timestamp: currentAlertStart,
            alertType: alert.type,
            duration: Date.now() - currentAlertStart,
            acknowledged: true,
          };
          setAnalytics((prev) => [...prev.slice(-99), entry]); // Keep last 100
        }
        setCurrentAlertStart(null);
        
        // Process next in queue
        setVoiceQueue((prev) => prev.slice(1));
      };

      utterance.onerror = (event) => {
        console.warn('[Voice] Speech synthesis error - this is normal and can be ignored. Event:', event.error || 'unknown');
        // Common errors: 'interrupted' (when skipping), 'canceled' (when stopping)
        // These are expected and don't need user attention
        setIsSpeaking(false);
        setVoiceQueue((prev) => prev.slice(1));
      };

      synth.speak(utterance);
    },
    [synth, voices, config, sounds, currentAlertStart]
  );

  const speakGoogle = useCallback(
    async (text: string) => {
      if (!config.apiKey) {
        console.error('[Voice] Google TTS requires API key');
        return;
      }

      try {
        const response = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: { text },
              voice: {
                languageCode: 'en-US',
                name: config.voice || 'en-US-Standard-A',
                ssmlGender: 'NEUTRAL',
              },
              audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: config.rate,
                pitch: config.pitch,
              },
            }),
          }
        );

        const data = await response.json();
        
        if (data.audioContent) {
          const audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
          audio.volume = config.volume;
          
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            setVoiceQueue((prev) => prev.slice(1));
          };
          
          await audio.play();
        }
      } catch (error) {
        console.error('[Voice] Google TTS error:', error);
        setIsSpeaking(false);
      }
    },
    [config]
  );

  const speak = useCallback(
    (text: string, options: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      type?: 'call' | 'bolo' | 'panic' | 'status' | 'admin' | 'notification';
      soundEffect?: boolean;
      department?: 'POLICE' | 'FIRE' | 'EMS';
      metadata?: Record<string, any>;
      supervisorOverride?: boolean;
      incidentId?: string;
    } = {}) => {
      if (!config.enabled) return;

      const {
        priority = 'normal',
        type = 'notification',
        soundEffect = true,
        department,
        metadata,
        supervisorOverride = false,
        incidentId,
      } = options;

      // Supervisor override bypasses mute
      if (!config.enabled && !supervisorOverride) return;

      const alert: VoiceAlert = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        type,
        priority,
        timestamp: Date.now(),
        department,
        metadata,
        supervisorOverride,
        incidentId,
        canSkip: !supervisorOverride,
      };

      setVoiceQueue((prev) => {
        const newQueue = [...prev, alert];
        // Supervisor overrides go first, then sort by priority
        if (supervisorOverride) {
          return [alert, ...prev];
        }
        if (priority === 'critical') {
          return [alert, ...prev];
        }
        return newQueue.sort((a, b) => {
          const priorityValues = { critical: 4, high: 3, normal: 2, low: 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        });
      });
    },
    [config.enabled]
  );

  const speakCustom = useCallback(
    (templateKey: string, variables: Record<string, string>) => {
      const template = config.customTemplates[templateKey];
      if (!template) {
        console.error(`Template "${templateKey}" not found`);
        return;
      }
      
      let text = template;
      Object.keys(variables).forEach((key) => {
        text = text.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
      });
      
      speak(text, { type: 'notification', priority: 'normal' });
    },
    [config.customTemplates, speak]
  );

  const saveTemplate = useCallback(
    (key: string, template: string) => {
      updateConfig({
        customTemplates: {
          ...config.customTemplates,
          [key]: template,
        },
      });
    },
    [config.customTemplates, updateConfig]
  );

  const skipCurrent = useCallback(() => {
    if (synth) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setVoiceQueue((prev) => prev.slice(1));
  }, [synth]);

  const clearQueue = useCallback(() => {
    setVoiceQueue([]);
  }, []);

  const getAnalytics = useCallback(() => {
    return [...analytics];
  }, [analytics]);

  // Process queue
  useEffect(() => {
    if (!isSpeaking && voiceQueue.length > 0) {
      const next = voiceQueue[0];
      
      if (config.provider === 'webspeech') {
        speakWebSpeech(next.text, next);
      } else if (config.provider === 'google') {
        speakGoogle(next.text);
      }
    }
  }, [isSpeaking, voiceQueue, config.provider, speakWebSpeech, speakGoogle]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setVoiceQueue([]);
  }, [synth]);

  const toggle = useCallback(() => {
    setConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
    if (config.enabled) {
      stop();
    }
  }, [config.enabled, stop]);

  const testVoice = useCallback(() => {
    speak('This is a test of the CAD voice alert system. All systems operational.', { priority: 'normal', type: 'notification' });
  }, [speak]);

  // Preset Management
  const savePreset = useCallback((name: string) => {
    const preset: VoicePreset = {
      id: `preset-${Date.now()}`,
      name,
      config: { ...config },
      createdAt: Date.now(),
    };
    const newPresets = [...presets, preset];
    setPresets(newPresets);
    localStorage.setItem('cad-voice-presets', JSON.stringify(newPresets));
  }, [config, presets]);

  const loadPreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (preset) {
      setConfig((prev) => ({ ...prev, ...preset.config }));
    }
  }, [presets]);

  const getPresets = useCallback(() => {
    return [...presets];
  }, [presets]);

  const deletePreset = useCallback((id: string) => {
    const newPresets = presets.filter((p) => p.id !== id);
    setPresets(newPresets);
    localStorage.setItem('cad-voice-presets', JSON.stringify(newPresets));
  }, [presets]);

  // Load presets from localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem('cad-voice-presets');
      if (saved) {
        try {
          setPresets(JSON.parse(saved));
        } catch (error) {
          console.error('[Voice] Failed to load presets:', error);
        }
      }
    }
  }, [mounted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted || !config.keyboardShortcuts.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey ? 'ctrl' : '',
        e.shiftKey ? 'shift' : '',
        e.altKey ? 'alt' : '',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      if (key === config.keyboardShortcuts.toggleMute) {
        e.preventDefault();
        toggle();
      } else if (key === config.keyboardShortcuts.skipCurrent) {
        e.preventDefault();
        skipCurrent();
      } else if (key === config.keyboardShortcuts.testVoice) {
        e.preventDefault();
        testVoice();
      } else if (key === config.keyboardShortcuts.clearQueue) {
        e.preventDefault();
        clearQueue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, config.keyboardShortcuts, toggle, skipCurrent, testVoice, clearQueue]);

  return (
    <VoiceContext.Provider
      value={{
        config,
        updateConfig,
        speak,
        speakCustom,
        stop,
        skipCurrent,
        clearQueue,
        isSpeaking,
        isEnabled: config.enabled,
        queue: voiceQueue,
        toggle,
        testVoice,
        getAnalytics,
        saveTemplate,
        savePreset,
        loadPreset,
        getPresets,
        deletePreset,
        activeDepartment,
        setActiveDepartment,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
}

// Voice alert templates
export const VoiceTemplates = {
  // Call alerts
  newCall: (callNumber: string, type: string, priority: string, location: string) =>
    `New ${priority} priority call. ${type} at ${location}. Call number ${callNumber}.`,
  
  // BOLO alerts
  boloHit: (plate: string, vehicle: string, location: string) =>
    `BOLO Alert. License plate ${plate}. ${vehicle}. Last seen at ${location}. Proceed with caution.`,
  
  stolenVehicle: (plate: string, vehicle: string) =>
    `Alert. Stolen vehicle detected. Plate ${plate}. ${vehicle}. Request backup immediately.`,
  
  // Emergency alerts
  panicButton: (callsign: string, location: string) =>
    `Emergency! Officer needs assistance. Unit ${callsign} activated panic button at ${location}. All available units respond.`,
  
  // Assignment alerts
  unitAssigned: (callsign: string, callNumber: string) =>
    `Unit ${callsign}, you have been assigned to call ${callNumber}.`,
  
  // Priority alerts
  priorityUpgrade: (callNumber: string, newPriority: string) =>
    `Attention. Call ${callNumber} upgraded to ${newPriority} priority.`,
  
  // Backup requests
  backupRequested: (callsign: string, location: string) =>
    `Backup requested. Unit ${callsign} needs assistance at ${location}.`,
  
  backupEnRoute: (respondingUnit: string, requestingUnit: string, eta: string) =>
    `Unit ${respondingUnit} is responding to ${requestingUnit}. ETA ${eta} minutes.`,
  
  // Status codes
  code4: (callNumber: string) =>
    `Code 4. Call ${callNumber} situation under control.`,
  
  // Unit status changes
  unitAvailable: (callsign: string) =>
    `Unit ${callsign} is now available for dispatch.`,
  
  unitBusy: (callsign: string, reason: string) =>
    `Unit ${callsign} is now busy. ${reason}.`,
  
  unitOffline: (callsign: string) =>
    `Unit ${callsign} is now offline.`,
  
  unitEnRoute: (callsign: string, destination: string, eta: string) =>
    `Unit ${callsign} en route to ${destination}. ETA ${eta} minutes.`,
  
  unitOnScene: (callsign: string, callNumber: string) =>
    `Unit ${callsign} is on scene at call ${callNumber}.`,
  
  // Shift alerts
  shiftStart: (officerName: string, shift: string) =>
    `Officer ${officerName} is starting ${shift} shift.`,
  
  shiftEnd: (officerName: string, timeRemaining: string) =>
    `Officer ${officerName}, your shift ends in ${timeRemaining}.`,
  
  shiftHandoff: (outgoingOfficer: string, incomingOfficer: string) =>
    `Shift handoff. ${outgoingOfficer} relieved by ${incomingOfficer}.`,
  
  // Zone alerts
  zoneEntry: (callsign: string, zoneName: string, alertLevel: string) =>
    `Unit ${callsign} entering ${zoneName}. Alert level: ${alertLevel}.`,
  
  // Administrative alerts
  systemUpdate: (minutes: string) =>
    `Attention all units. CAD system update in ${minutes} minutes. Please complete current operations.`,
  
  trainingAvailable: (trainingName: string) =>
    `New training available: ${trainingName}. Complete within 7 days.`,
  
  warrantsUpdate: (count: string) =>
    `Warrants database updated. ${count} new active warrants.`,
  
  // ETA alerts
  etaUpdate: (callsign: string, newEta: string) =>
    `ETA update. Unit ${callsign} now ${newEta} minutes out.`,
  
  // Medical alerts (EMS)
  medicalEmergency: (location: string, condition: string) =>
    `Medical emergency. ${condition}. Location: ${location}. Immediate response required.`,
  
  ambulanceRequested: (callNumber: string, location: string) =>
    `Ambulance requested for call ${callNumber} at ${location}.`,
  
  // Fire alerts
  fireEmergency: (location: string, type: string, alarm: string) =>
    `Fire emergency. ${type}. ${alarm} alarm at ${location}. All units respond.`,
  
  hazmatAlert: (location: string, material: string) =>
    `Hazmat alert. ${material} at ${location}. Proceed with extreme caution.`,
};
