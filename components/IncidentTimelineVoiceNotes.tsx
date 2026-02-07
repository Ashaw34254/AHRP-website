'use client';

import { useState, useCallback } from 'react';
import { Card, CardBody, Button, Chip, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Mic, Play, Pause, Trash2, Clock, MessageSquare, Radio } from 'lucide-react';
import { useCADVoiceAlerts } from '@/lib/use-voice-alerts';

interface VoiceNote {
  id: string;
  incidentId: string;
  timestamp: number;
  transcription: string;
  duration: number;
  officer: string;
  isPlaying?: boolean;
}

interface TimelineEntry {
  id: string;
  timestamp: number;
  type: 'status' | 'note' | 'voice' | 'update';
  content: string;
  officer: string;
  voiceNote?: VoiceNote;
}

interface IncidentTimelineVoiceNotesProps {
  incidentId?: string;
}

export default function IncidentTimelineVoiceNotes({ incidentId = 'INC-2024-001' }: IncidentTimelineVoiceNotesProps) {
  const voiceAlerts = useCADVoiceAlerts();
  const [timeline, setTimeline] = useState<TimelineEntry[]>([
    {
      id: 'entry-1',
      timestamp: Date.now() - 3600000,
      type: 'status',
      content: 'Incident created',
      officer: 'Dispatcher',
    },
    {
      id: 'entry-2',
      timestamp: Date.now() - 3000000,
      type: 'update',
      content: 'Units A-247 and B-105 assigned',
      officer: 'Dispatcher',
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [manualNote, setManualNote] = useState('');

  // Start voice recording (simulated)
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingDuration(0);

    voiceAlerts.speak('Recording started', {
      priority: 'low',
      type: 'notification',
      department: 'POLICE',
    });

    // Simulate recording duration
    const interval = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);

    // Auto-stop after 30 seconds (simulated)
    setTimeout(() => {
      stopRecording();
      clearInterval(interval);
    }, 30000);

    // Store interval ID for cleanup
    (window as any).__recordingInterval = interval;
  }, [voiceAlerts]);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    clearInterval((window as any).__recordingInterval);

    const voiceNote: VoiceNote = {
      id: `voice-${Date.now()}`,
      incidentId,
      timestamp: Date.now(),
      transcription: `[Simulated voice note] Officer on scene. Suspect in custody. No injuries reported. Vehicle secured. ${recordingDuration} seconds.`,
      duration: recordingDuration,
      officer: 'Officer Smith',
    };

    const newEntry: TimelineEntry = {
      id: `entry-${Date.now()}`,
      timestamp: Date.now(),
      type: 'voice',
      content: voiceNote.transcription,
      officer: voiceNote.officer,
      voiceNote,
    };

    setTimeline((prev) => [...prev, newEntry]);
    setRecordingDuration(0);

    voiceAlerts.speak('Voice note saved to incident timeline', {
      priority: 'low',
      type: 'notification',
      department: 'POLICE',
    });
  }, [incidentId, recordingDuration, voiceAlerts]);

  // Play voice note (simulated)
  const playVoiceNote = useCallback((note: VoiceNote) => {
    setTimeline((prev) =>
      prev.map((entry) =>
        entry.voiceNote?.id === note.id
          ? { ...entry, voiceNote: { ...entry.voiceNote, isPlaying: true } }
          : entry
      )
    );

    voiceAlerts.speak(note.transcription, {
      priority: 'low',
      type: 'notification',
      department: 'POLICE',
      incidentId: note.incidentId,
    });

    // Auto-stop playing after duration
    setTimeout(() => {
      setTimeline((prev) =>
        prev.map((entry) =>
          entry.voiceNote?.id === note.id
            ? { ...entry, voiceNote: { ...entry.voiceNote, isPlaying: false } }
            : entry
        )
      );
    }, note.duration * 1000);
  }, [voiceAlerts]);

  // Add manual note
  const addManualNote = useCallback(() => {
    if (!manualNote.trim()) return;

    const newEntry: TimelineEntry = {
      id: `entry-${Date.now()}`,
      timestamp: Date.now(),
      type: 'note',
      content: manualNote,
      officer: 'Current User',
    };

    setTimeline((prev) => [...prev, newEntry]);
    setManualNote('');
    setShowNoteModal(false);

    voiceAlerts.speak('Note added to incident timeline', {
      priority: 'low',
      type: 'notification',
      department: 'POLICE',
    });
  }, [manualNote, voiceAlerts]);

  // Delete timeline entry
  const deleteEntry = useCallback((entryId: string) => {
    setTimeline((prev) => prev.filter((e) => e.id !== entryId));
    voiceAlerts.speak('Timeline entry deleted', {
      priority: 'low',
      type: 'notification',
      department: 'POLICE',
    });
  }, [voiceAlerts]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEntryIcon = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'voice':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'note':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'update':
        return <Radio className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEntryColor = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'voice':
        return 'secondary';
      case 'note':
        return 'primary';
      case 'update':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Incident Timeline: {incidentId}</h2>
              <p className="text-sm text-gray-400">Voice-enhanced incident documentation</p>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="flat"
                startContent={<MessageSquare className="w-4 h-4" />}
                onPress={() => setShowNoteModal(true)}
              >
                Add Note
              </Button>
              <Button
                color={isRecording ? 'danger' : 'secondary'}
                startContent={<Mic className="w-4 h-4" />}
                onPress={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? `Stop (${formatDuration(recordingDuration)})` : 'Record Voice Note'}
              </Button>
            </div>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/30 border border-red-500/50">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-medium">Recording...</span>
              <span className="text-gray-400">{formatDuration(recordingDuration)}</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Timeline */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-bold text-white mb-4">Timeline ({timeline.length} entries)</h3>
          
          <div className="space-y-3">
            {timeline
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative pl-8 pb-4 border-l-2 border-gray-700 last:border-l-0 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-[9px]">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      entry.type === 'voice' ? 'bg-purple-500 border-purple-400' :
                      entry.type === 'note' ? 'bg-blue-500 border-blue-400' :
                      entry.type === 'update' ? 'bg-green-500 border-green-400' :
                      'bg-gray-500 border-gray-400'
                    }`} />
                  </div>

                  <Card className="border border-gray-700/50">
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-2">
                            {getEntryIcon(entry.type)}
                            <Chip size="sm" color={getEntryColor(entry.type)} variant="flat">
                              {entry.type.toUpperCase()}
                            </Chip>
                            <span className="text-xs text-gray-400">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-xs text-gray-500">by {entry.officer}</span>
                          </div>

                          {/* Content */}
                          <p className="text-sm text-white mb-2">{entry.content}</p>

                          {/* Voice Note Controls */}
                          {entry.voiceNote && (
                            <div className="flex items-center gap-3 mt-2 p-2 rounded bg-purple-950/20 border border-purple-500/30">
                              <Button
                                size="sm"
                                color="secondary"
                                variant="flat"
                                isIconOnly
                                onPress={() => playVoiceNote(entry.voiceNote!)}
                                isDisabled={entry.voiceNote.isPlaying}
                              >
                                {entry.voiceNote.isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <div className="text-xs text-gray-400">
                                  Duration: {formatDuration(entry.voiceNote.duration)}
                                </div>
                                {entry.voiceNote.isPlaying && (
                                  <div className="w-full bg-gray-700 h-1 rounded-full mt-1 overflow-hidden">
                                    <div className="bg-purple-500 h-full animate-pulse" style={{ width: '50%' }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        {(entry.type === 'note' || entry.type === 'voice') && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onPress={() => deleteEntry(entry.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>

      {/* Add Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)}>
        <ModalContent>
          <ModalHeader>Add Note to Timeline</ModalHeader>
          <ModalBody>
            <Textarea
              label="Note"
              placeholder="Enter incident note..."
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={addManualNote}>
              Add Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
