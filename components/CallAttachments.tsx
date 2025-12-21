"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { Paperclip, Upload, X, File, Image, Video, FileText } from "lucide-react";
import { toast } from "@/lib/toast";

interface CallAttachment {
  id: string;
  callId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
}

interface CallAttachmentsProps {
  callId: string;
  callNumber: string;
}

export function CallAttachments({ callId, callNumber }: CallAttachmentsProps) {
  const [attachments, setAttachments] = useState<CallAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAttachments();
  }, [callId]);

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/api/cad/calls/${callId}/attachments`);
      if (response.ok) {
        const data = await response.json();
        setAttachments(data.attachments || []);
      }
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
    }
  };

  const handleAddAttachment = async () => {
    if (!fileName || !fileUrl) {
      toast.error("File name and URL are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileUrl,
          fileType: fileType || "document",
          description,
          uploadedBy: "System", // TODO: Get from session
        }),
      });

      if (response.ok) {
        toast.success("Attachment added");
        fetchAttachments();
        onClose();
        setFileName("");
        setFileUrl("");
        setFileType("");
        setDescription("");
      } else {
        toast.error("Failed to add attachment");
      }
    } catch (error) {
      toast.error("Failed to add attachment");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = async (attachmentId: string) => {
    try {
      const response = await fetch(`/api/cad/calls/${callId}/attachments/${attachmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Attachment removed");
        fetchAttachments();
      }
    } catch (error) {
      toast.error("Failed to remove attachment");
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "primary";
      case "video":
        return "secondary";
      case "document":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-white">
            Attachments ({attachments.length})
          </span>
        </div>
        <Button size="sm" color="primary" variant="flat" onPress={onOpen}>
          <Upload className="w-3 h-3" />
          Add
        </Button>
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">No attachments</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="bg-gray-800/30 border border-gray-700">
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Chip
                      size="sm"
                      color={getFileTypeColor(attachment.fileType)}
                      variant="flat"
                      startContent={getFileIcon(attachment.fileType)}
                    >
                      {attachment.fileType}
                    </Chip>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {attachment.fileName}
                      </p>
                      {attachment.description && (
                        <p className="text-xs text-gray-400 truncate">{attachment.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {attachment.uploadedBy} • {new Date(attachment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      as="a"
                      href={attachment.fileUrl}
                      target="_blank"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      isIconOnly
                      onPress={() => handleRemoveAttachment(attachment.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add Attachment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add Attachment to {callNumber}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="File Name"
                placeholder="e.g., Evidence_Photo_1.jpg"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                isRequired
              />
              <Input
                label="File URL"
                placeholder="https://example.com/file.jpg"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                isRequired
              />
              <Input
                label="File Type"
                placeholder="image, video, document"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minRows={2}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddAttachment} isLoading={loading}>
              Add Attachment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
