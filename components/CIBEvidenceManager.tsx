"use client";

import { useState } from "react";
import {
  Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem,
  Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Tooltip, Progress
} from "@nextui-org/react";
import {
  Paperclip, Plus, Eye, Download, FileText, Image, Video, File,
  User, Calendar, MapPin, Shield, AlertTriangle, Check, X, Upload, Link2
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Evidence {
  id: string;
  evidenceNumber: string;
  type: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  collectedAt: string;
  collectedBy: string;
  location?: string;
  custodyLog?: any[];
  isSeized: boolean;
  seizureAuthority?: string;
  forensicNotes?: string;
  analysedBy?: string;
  analysedAt?: string;
  status: string;
  relevanceScore: number;
  tags?: string[];
  isSuperseded: boolean;
  supersededReason?: string;
}

interface Props {
  investigationId: string;
  evidence: Evidence[];
  onUpdate: () => void;
}

export function CIBEvidenceManager({ investigationId, evidence, onUpdate }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [saving, setSaving] = useState(false);

  // New evidence form
  const [newEvidence, setNewEvidence] = useState({
    type: "PHOTO",
    description: "",
    fileUrl: "",
    fileName: "",
    collectedBy: "Current User",
    location: "",
    isSeized: false,
    seizureAuthority: "",
    relevanceScore: 5
  });

  const handleAddEvidence = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cad/investigations/${investigationId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvidence)
      });

      if (response.ok) {
        toast.success("Evidence added successfully");
        onClose();
        onUpdate();
        // Reset form
        setNewEvidence({
          type: "PHOTO",
          description: "",
          fileUrl: "",
          fileName: "",
          collectedBy: "Current User",
          location: "",
          isSeized: false,
          seizureAuthority: "",
          relevanceScore: 5
        });
      } else {
        throw new Error("Failed to add evidence");
      }
    } catch (error) {
      console.error("Failed to add evidence:", error);
      toast.error("Failed to add evidence");
    } finally {
      setSaving(false);
    }
  };

  const viewEvidence = (ev: Evidence) => {
    setSelectedEvidence(ev);
    onViewOpen();
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      CCTV: Video,
      PHOTO: Image,
      DOCUMENT: FileText,
      AUDIO: File,
      WITNESS_STATEMENT: User,
      PHYSICAL: Paperclip,
      DIGITAL: File,
      FORENSIC: Shield
    };
    const Icon = icons[type] || File;
    return <Icon className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "warning",
      PROCESSED: "primary",
      ANALYSED: "success",
      COURT_READY: "success",
      SUPERSEDED: "default"
    };
    return colors[status] || "default";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Evidence</h3>
          <p className="text-sm text-gray-400">{evidence.length} items on record</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
        >
          Add Evidence
        </Button>
      </div>

      {/* Evidence List */}
      {evidence.length === 0 ? (
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardBody className="p-8 text-center">
            <Paperclip className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No evidence recorded yet</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {evidence.map((ev) => (
            <Card 
              key={ev.id}
              className="bg-gray-800/50 border border-gray-700 hover:border-indigo-600/50 transition-all cursor-pointer"
              isPressable
              onPress={() => viewEvidence(ev)}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail or Icon */}
                  <div className="w-16 h-16 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center flex-shrink-0">
                    {ev.thumbnailUrl ? (
                      <img 
                        src={ev.thumbnailUrl} 
                        alt={ev.description}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-indigo-400">
                        {getTypeIcon(ev.type)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-indigo-400">{ev.evidenceNumber}</span>
                          <Chip size="sm" color={getStatusColor(ev.status) as any} variant="flat">
                            {ev.status}
                          </Chip>
                          {ev.isSeized && (
                            <Chip size="sm" color="danger" variant="flat" startContent={<Shield className="w-3 h-3" />}>
                              SEIZED
                            </Chip>
                          )}
                        </div>
                        <p className="text-white font-medium mb-1">{ev.description}</p>
                        <p className="text-sm text-gray-400">{ev.type.replace(/_/g, " ")}</p>
                      </div>

                      {/* Relevance Score */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Relevance</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={ev.relevanceScore * 10}
                            color={ev.relevanceScore >= 7 ? "success" : ev.relevanceScore >= 5 ? "warning" : "danger"}
                            size="sm"
                            className="w-20"
                          />
                          <span className="text-sm font-semibold text-white">{ev.relevanceScore}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{ev.collectedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(ev.collectedAt).toLocaleDateString()}</span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                      {ev.fileName && (
                        <div className="flex items-center gap-1">
                          <File className="w-3 h-3" />
                          <span>{ev.fileName} ({formatFileSize(ev.fileSize)})</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {ev.tags && ev.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {ev.tags.map((tag, idx) => (
                          <Chip key={idx} size="sm" variant="flat" color="primary">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Tooltip content="View Details">
                      <Button 
                        size="sm" 
                        isIconOnly 
                        variant="flat" 
                        color="primary"
                        onPress={() => viewEvidence(ev)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    {ev.fileUrl && (
                      <Tooltip content="Download">
                        <Button 
                          size="sm" 
                          isIconOnly 
                          variant="flat" 
                          color="default"
                          as="a"
                          href={ev.fileUrl}
                          target="_blank"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add Evidence Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Add Evidence</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Evidence Type"
                selectedKeys={[newEvidence.type]}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
              >
                <SelectItem key="PHOTO" value="PHOTO">Photo</SelectItem>
                <SelectItem key="CCTV" value="CCTV">CCTV Footage</SelectItem>
                <SelectItem key="VIDEO" value="VIDEO">Video</SelectItem>
                <SelectItem key="DOCUMENT" value="DOCUMENT">Document</SelectItem>
                <SelectItem key="AUDIO" value="AUDIO">Audio Recording</SelectItem>
                <SelectItem key="WITNESS_STATEMENT" value="WITNESS_STATEMENT">Witness Statement</SelectItem>
                <SelectItem key="PHYSICAL" value="PHYSICAL">Physical Evidence</SelectItem>
                <SelectItem key="DIGITAL" value="DIGITAL">Digital Evidence</SelectItem>
                <SelectItem key="FORENSIC" value="FORENSIC">Forensic Evidence</SelectItem>
              </Select>

              <Textarea
                label="Description"
                placeholder="Detailed description of the evidence..."
                value={newEvidence.description}
                onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                minRows={3}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <Input
                label="File URL"
                placeholder="https://..."
                value={newEvidence.fileUrl}
                onChange={(e) => setNewEvidence({ ...newEvidence, fileUrl: e.target.value })}
                startContent={<Link2 className="w-4 h-4 text-gray-400" />}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Collected By"
                  value={newEvidence.collectedBy}
                  onChange={(e) => setNewEvidence({ ...newEvidence, collectedBy: e.target.value })}
                  classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
                />

                <Input
                  label="Location"
                  placeholder="Where was this collected?"
                  value={newEvidence.location}
                  onChange={(e) => setNewEvidence({ ...newEvidence, location: e.target.value })}
                  classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <input
                      type="checkbox"
                      checked={newEvidence.isSeized}
                      onChange={(e) => setNewEvidence({ ...newEvidence, isSeized: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800"
                    />
                    Evidence Seized
                  </label>
                </div>

                {newEvidence.isSeized && (
                  <Input
                    label="Seizure Authority"
                    placeholder="Warrant number..."
                    value={newEvidence.seizureAuthority}
                    onChange={(e) => setNewEvidence({ ...newEvidence, seizureAuthority: e.target.value })}
                    classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
                  />
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Relevance Score: {newEvidence.relevanceScore}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEvidence.relevanceScore}
                  onChange={(e) => setNewEvidence({ ...newEvidence, relevanceScore: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button 
              color="primary" 
              onPress={handleAddEvidence}
              isLoading={saving}
            >
              Add Evidence
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Evidence Modal */}
      {selectedEvidence && (
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="3xl">
          <ModalContent>
            <ModalHeader>
              <div>
                <p className="font-mono text-sm text-indigo-400">{selectedEvidence.evidenceNumber}</p>
                <p className="text-white">{selectedEvidence.description}</p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Evidence details */}
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardBody className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Type</p>
                        <p className="text-white">{selectedEvidence.type.replace(/_/g, " ")}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <Chip size="sm" color={getStatusColor(selectedEvidence.status) as any} variant="flat">
                          {selectedEvidence.status}
                        </Chip>
                      </div>
                      <div>
                        <p className="text-gray-400">Collected By</p>
                        <p className="text-white">{selectedEvidence.collectedBy}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Collected At</p>
                        <p className="text-white">{new Date(selectedEvidence.collectedAt).toLocaleString()}</p>
                      </div>
                      {selectedEvidence.location && (
                        <div>
                          <p className="text-gray-400">Location</p>
                          <p className="text-white">{selectedEvidence.location}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400">Relevance</p>
                        <p className="text-white">{selectedEvidence.relevanceScore}/10</p>
                      </div>
                    </div>

                    {selectedEvidence.forensicNotes && (
                      <div>
                        <p className="text-gray-400 mb-2">Forensic Notes</p>
                        <p className="text-white whitespace-pre-wrap">{selectedEvidence.forensicNotes}</p>
                      </div>
                    )}

                    {selectedEvidence.custodyLog && selectedEvidence.custodyLog.length > 0 && (
                      <div>
                        <p className="text-gray-400 mb-2">Chain of Custody</p>
                        <div className="space-y-2">
                          {selectedEvidence.custodyLog.map((log, idx) => (
                            <div key={idx} className="bg-gray-900/50 p-2 rounded border border-gray-700 text-xs">
                              <span className="text-indigo-400">{log.officer}</span> - {log.action} - {log.timestamp}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
