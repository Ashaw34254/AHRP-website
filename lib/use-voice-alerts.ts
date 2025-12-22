'use client';

import { useEffect } from 'react';
import { useVoice, VoiceTemplates } from './voice-context';

/**
 * Hook for CAD components to trigger voice alerts with full feature support
 */
export function useCADVoiceAlerts() {
  const { speak, config } = useVoice();

  // Call alerts
  const announceNewCall = (call: {
    callNumber: string;
    type: string;
    priority: string;
    location: string;
    department?: 'POLICE' | 'FIRE' | 'EMS';
  }) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.newCall(
      call.callNumber,
      call.type,
      call.priority,
      call.location
    );
    
    const priority = call.priority === 'CRITICAL' ? 'critical' : 
                    call.priority === 'HIGH' ? 'high' : 'normal';
    
    speak(text, { 
      priority: priority as any,
      type: 'call',
      department: call.department,
      soundEffect: true,
    });
  };

  // BOLO alerts
  const announceBOLOHit = (data: {
    plate: string;
    vehicle: string;
    location: string;
  }) => {
    if (!config.alertTypes.boloHits) return;
    
    const text = VoiceTemplates.boloHit(data.plate, data.vehicle, data.location);
    speak(text, { priority: 'critical', type: 'bolo', soundEffect: true });
  };

  const announceStolenVehicle = (data: {
    plate: string;
    vehicle: string;
  }) => {
    if (!config.alertTypes.boloHits) return;
    
    const text = VoiceTemplates.stolenVehicle(data.plate, data.vehicle);
    speak(text, { priority: 'critical', type: 'bolo', soundEffect: true });
  };

  // Emergency alerts
  const announcePanicButton = (data: {
    callsign: string;
    location: string;
  }) => {
    if (!config.alertTypes.panicAlerts) return;
    
    const text = VoiceTemplates.panicButton(data.callsign, data.location);
    speak(text, { priority: 'critical', type: 'panic', soundEffect: true });
  };

  // Assignment alerts
  const announceUnitAssigned = (data: {
    callsign: string;
    callNumber: string;
  }) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.unitAssigned(data.callsign, data.callNumber);
    speak(text, { priority: 'normal', type: 'notification' });
  };

  // Priority alerts
  const announcePriorityUpgrade = (data: {
    callNumber: string;
    newPriority: string;
  }) => {
    if (!config.alertTypes.priorityAlerts) return;
    
    const text = VoiceTemplates.priorityUpgrade(data.callNumber, data.newPriority);
    speak(text, { priority: 'high', type: 'call', soundEffect: true });
  };

  // Backup requests
  const announceBackupRequested = (data: {
    callsign: string;
    location: string;
  }) => {
    if (!config.alertTypes.backupRequests) return;
    
    const text = VoiceTemplates.backupRequested(data.callsign, data.location);
    speak(text, { priority: 'high', type: 'call', soundEffect: true });
  };

  const announceBackupEnRoute = (data: {
    respondingUnit: string;
    requestingUnit: string;
    eta: string;
  }) => {
    if (!config.alertTypes.backupRequests) return;
    
    const text = VoiceTemplates.backupEnRoute(
      data.respondingUnit,
      data.requestingUnit,
      data.eta
    );
    speak(text, { priority: 'normal', type: 'notification' });
  };

  // Status codes
  const announceCode4 = (callNumber: string) => {
    const text = VoiceTemplates.code4(callNumber);
    speak(text, { priority: 'low', type: 'notification' });
  };

  // Unit status changes
  const announceUnitAvailable = (callsign: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.unitAvailable(callsign);
    speak(text, { priority: 'low', type: 'status' });
  };

  const announceUnitBusy = (callsign: string, reason: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.unitBusy(callsign, reason);
    speak(text, { priority: 'low', type: 'status' });
  };

  const announceUnitOffline = (callsign: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.unitOffline(callsign);
    speak(text, { priority: 'low', type: 'status' });
  };

  const announceUnitEnRoute = (callsign: string, destination: string, eta: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.unitEnRoute(callsign, destination, eta);
    speak(text, { priority: 'normal', type: 'status' });
  };

  const announceUnitOnScene = (callsign: string, callNumber: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.unitOnScene(callsign, callNumber);
    speak(text, { priority: 'normal', type: 'status' });
  };

  // Shift alerts
  const announceShiftStart = (officerName: string, shift: string) => {
    if (!config.alertTypes.shiftReminders) return;
    
    const text = VoiceTemplates.shiftStart(officerName, shift);
    speak(text, { priority: 'low', type: 'admin' });
  };

  const announceShiftEnd = (officerName: string, timeRemaining: string) => {
    if (!config.alertTypes.shiftReminders) return;
    
    const text = VoiceTemplates.shiftEnd(officerName, timeRemaining);
    speak(text, { priority: 'low', type: 'admin' });
  };

  const announceShiftHandoff = (outgoingOfficer: string, incomingOfficer: string) => {
    if (!config.alertTypes.shiftReminders) return;
    
    const text = VoiceTemplates.shiftHandoff(outgoingOfficer, incomingOfficer);
    speak(text, { priority: 'normal', type: 'admin' });
  };

  // Zone alerts
  const announceZoneEntry = (callsign: string, zoneName: string, alertLevel: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.zoneEntry(callsign, zoneName, alertLevel);
    const priority = alertLevel === 'HIGH' ? 'high' : 'normal';
    speak(text, { priority: priority as any, type: 'status', soundEffect: true });
  };

  // Administrative alerts
  const announceSystemUpdate = (minutes: string) => {
    if (!config.alertTypes.adminAlerts) return;
    
    const text = VoiceTemplates.systemUpdate(minutes);
    speak(text, { priority: 'high', type: 'admin', soundEffect: true });
  };

  const announceTrainingAvailable = (trainingName: string) => {
    if (!config.alertTypes.adminAlerts) return;
    
    const text = VoiceTemplates.trainingAvailable(trainingName);
    speak(text, { priority: 'low', type: 'admin' });
  };

  const announceWarrantsUpdate = (count: string) => {
    if (!config.alertTypes.adminAlerts) return;
    
    const text = VoiceTemplates.warrantsUpdate(count);
    speak(text, { priority: 'normal', type: 'admin' });
  };

  // ETA alerts
  const announceETAUpdate = (callsign: string, newEta: string) => {
    if (!config.alertTypes.statusChanges) return;
    
    const text = VoiceTemplates.etaUpdate(callsign, newEta);
    speak(text, { priority: 'normal', type: 'status' });
  };

  // Medical alerts (EMS)
  const announceMedicalEmergency = (location: string, condition: string) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.medicalEmergency(location, condition);
    speak(text, { 
      priority: 'critical', 
      type: 'call', 
      department: 'EMS',
      soundEffect: true 
    });
  };

  const announceAmbulanceRequested = (callNumber: string, location: string) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.ambulanceRequested(callNumber, location);
    speak(text, { 
      priority: 'high', 
      type: 'call', 
      department: 'EMS',
      soundEffect: true 
    });
  };

  // Fire alerts
  const announceFireEmergency = (location: string, type: string, alarm: string) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.fireEmergency(location, type, alarm);
    speak(text, { 
      priority: 'critical', 
      type: 'call', 
      department: 'FIRE',
      soundEffect: true 
    });
  };

  const announceHazmatAlert = (location: string, material: string) => {
    if (!config.alertTypes.newCalls) return;
    
    const text = VoiceTemplates.hazmatAlert(location, material);
    speak(text, { 
      priority: 'critical', 
      type: 'call', 
      department: 'FIRE',
      soundEffect: true 
    });
  };

  return {
    announceNewCall,
    announceBOLOHit,
    announceStolenVehicle,
    announcePanicButton,
    announceUnitAssigned,
    announcePriorityUpgrade,
    announceBackupRequested,
    announceBackupEnRoute,
    announceCode4,
    announceUnitAvailable,
    announceUnitBusy,
    announceUnitOffline,
    announceUnitEnRoute,
    announceUnitOnScene,
    announceShiftStart,
    announceShiftEnd,
    announceShiftHandoff,
    announceZoneEntry,
    announceSystemUpdate,
    announceTrainingAvailable,
    announceWarrantsUpdate,
    announceETAUpdate,
    announceMedicalEmergency,
    announceAmbulanceRequested,
    announceFireEmergency,
    announceHazmatAlert,
    speak,
  };
}

/**
 * Hook to monitor CAD events and trigger voice alerts automatically
 */
export function useAutoVoiceAlerts() {
  const voiceAlerts = useCADVoiceAlerts();

  useEffect(() => {
    // Listen for custom events from CAD components
    const handleNewCall = ((event: CustomEvent) => {
      voiceAlerts.announceNewCall(event.detail);
    }) as EventListener;

    const handleBOLOHit = ((event: CustomEvent) => {
      voiceAlerts.announceBOLOHit(event.detail);
    }) as EventListener;

    const handlePanicAlert = ((event: CustomEvent) => {
      voiceAlerts.announcePanicButton(event.detail);
    }) as EventListener;

    window.addEventListener('cad:newCall', handleNewCall);
    window.addEventListener('cad:boloHit', handleBOLOHit);
    window.addEventListener('cad:panicAlert', handlePanicAlert);

    return () => {
      window.removeEventListener('cad:newCall', handleNewCall);
      window.removeEventListener('cad:boloHit', handleBOLOHit);
      window.removeEventListener('cad:panicAlert', handlePanicAlert);
    };
  }, [voiceAlerts]);

  return voiceAlerts;
}

/**
 * Utility to trigger CAD events that voice alerts listen for
 */
export const triggerCADEvent = (eventType: string, detail: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`cad:${eventType}`, { detail }));
  }
};
