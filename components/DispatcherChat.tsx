"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  ScrollShadow,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { MessageCircle, Send, Users, AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface DispatcherSession {
  id: string;
  userId: string;
  name: string;
  callsign: string;
  status: string;
  department: string;
  startedAt: string;
}

interface Message {
  id: string;
  fromUserId: string;
  fromName: string;
  fromCallsign?: string;
  fromDepartment?: string;
  toUserId?: string;
  toName?: string;
  toCallsign?: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  callNumber?: string;
  location?: string;
  isPinned?: boolean;
  reactions?: { emoji: string; userId: string; userName: string }[];
  editedAt?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  // New fields
  threadId?: string;
  parentId?: string;
  replies?: Message[];
  mentions?: string[];
  category?: string;
  isBookmarked?: boolean;
  channel?: string;
  expiresAt?: string;
  isTemplate?: boolean;
  templateName?: string;
  coordinates?: { lat: number; lng: number };
  gifUrl?: string;
}

interface DispatcherChatProps {
  department?: string;
}

export function DispatcherChat({ department }: DispatcherChatProps = { department: undefined }) {
  const [sessions, setSessions] = useState<DispatcherSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("NORMAL");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [showPMOnly, setShowPMOnly] = useState(false);
  const [playSound, setPlaySound] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [dndMode, setDndMode] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  // New states
  const [selectedChannel, setSelectedChannel] = useState(() => {
    // Load from localStorage or default to "general"
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dispatcher-selected-channel') || "general";
    }
    return "general";
  });
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [callsign, setCallsign] = useState("DISP-1");
  const [messageExpiry, setMessageExpiry] = useState<number | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<string[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const currentUserId = "system"; // TODO: Get from session
  
  const channels = [
    { id: "general", name: "General", icon: "💬" },
    { id: "operations", name: "Operations", icon: "🚨" },
    { id: "admin", name: "Admin", icon: "⚙️" },
    { id: "shifts", name: "Shift Notes", icon: "📋" }
  ];
  
  const categories = [
    { id: "traffic", name: "Traffic", color: "warning" },
    { id: "medical", name: "Medical", color: "danger" },
    { id: "fire", name: "Fire", color: "danger" },
    { id: "admin", name: "Admin", color: "default" },
    { id: "update", name: "Update", color: "primary" }
  ];
  
  const quickCodes: Record<string, string> = {
    "/10-4": "10-4 (Acknowledged)",
    "/10-8": "10-8 (In Service)",
    "/10-23": "10-23 (Arrived on Scene)",
    "/backup": "Requesting immediate backup",
    "/clear": "All clear, situation resolved",
    "/busy": "Currently handling call, stand by"
  };

  // Helper functions for new features
  const startThread = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setSelectedThread(messageId);
      setShowThreads(true);
      setReplyingTo(message);
      toast.success("Started thread - your next message will be a reply");
    }
  };

  const closeThread = () => {
    setSelectedThread(null);
    setShowThreads(false);
    setReplyingTo(null);
  };

  const markAsReadWithReceipt = async (messageId: string) => {
    try {
      await fetch("/api/cad/dispatcher/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          userId: currentUserId,
          userName: callsign || "Dispatcher",
        }),
      });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const toggleBookmark = async (messageId: string) => {
    const isCurrentlyBookmarked = bookmarkedMessages.includes(messageId);
    
    try {
      if (isCurrentlyBookmarked) {
        await fetch(`/api/cad/dispatcher/bookmarks?userId=${currentUserId}&messageId=${messageId}`, {
          method: "DELETE",
        });
        setBookmarkedMessages(prev => prev.filter(id => id !== messageId));
        toast.success("Bookmark removed");
      } else {
        await fetch("/api/cad/dispatcher/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, messageId }),
        });
        setBookmarkedMessages(prev => [...prev, messageId]);
        const message = messages.find(m => m.id === messageId);
        toast.success(`Bookmarked: ${message?.message.substring(0, 30)}...`);
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const saveAsTemplate = async (message: Message, name: string) => {
    try {
      const response = await fetch("/api/cad/dispatcher/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          name,
          text: message.message,
          category: message.category || "update",
          department,
          isPublic: false,
        }),
      });
      
      if (response.ok) {
        const { template } = await response.json();
        setSavedTemplates(prev => [...prev, template]);
        toast.success(`Template "${name}" saved`);
      }
    } catch (error) {
      toast.error("Failed to save template");
    }
  };

  const detectMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const autoLinkCalls = (text: string): string => {
    // Detect call numbers like #2024-001, #C-123, etc.
    const callRegex = /#([A-Z0-9-]+)/g;
    return text.replace(callRegex, '<a href="/dashboard/calls/$1" class="text-blue-500 hover:underline">#$1</a>');
  };

  const processQuickCode = (text: string): string => {
    for (const [code, replacement] of Object.entries(quickCodes)) {
      if (text.startsWith(code)) {
        return replacement + text.slice(code.length);
      }
    }
    return text;
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessageText(prev => prev + " " + transcript);
        setVoiceEnabled(false);
      };
      
      recognitionRef.current.onerror = () => {
        toast.error("Voice input error");
        setVoiceEnabled(false);
      };
    }

    try {
      setVoiceEnabled(true);
      recognitionRef.current.start();
      toast.success("Voice input started");
    } catch (error) {
      toast.error("Failed to start voice input");
      setVoiceEnabled(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    toast.success(`High contrast ${!highContrast ? "enabled" : "disabled"}`);
  };

  const applyTemplate = (template: any) => {
    setMessageText(template.text);
    setSelectedCategory(template.category);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" applied`);
  };

  const insertGif = (gifUrl: string) => {
    // In production, integrate with Giphy/Tenor API
    setMessageText(prev => `${prev} [GIF: ${gifUrl}]`);
    setShowGifPicker(false);
    toast.success("GIF added");
  };

  const updateMentionSuggestions = (text: string) => {
    const lastWord = text.split(" ").pop() || "";
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      // Mock user list - in production, fetch from API
      const users = ["Admin", "Dispatch1", "Unit-A12", "Unit-B5", "Supervisor"];
      const suggestions = users.filter(u => 
        u.toLowerCase().includes(query)
      );
      setMentionSuggestions(suggestions);
      setShowMentions(suggestions.length > 0);
    } else {
      setShowMentions(false);
      setMentionSuggestions([]);
    }
  };

  const insertMention = (username: string) => {
    const words = messageText.split(" ");
    words[words.length - 1] = `@${username}`;
    setMessageText(words.join(" ") + " ");
    setShowMentions(false);
    setMentionSuggestions([]);
  };
  
  const quickReplies = [
    "10-4 (Acknowledged)",
    "10-8 (In Service)",
    "10-23 (Arrived on Scene)",
    "10-19 (Return to Station)",
    "10-97 (Arrived)",
    "Copy that",
    "En route",
    "On scene",
    "Clear",
    "Stand by",
    "Request backup",
    "All units clear"
  ];

  useEffect(() => {
    fetchSessions();
    fetchMessages();
    fetchBookmarks();
    fetchTemplates();
    
    const interval = setInterval(() => {
      fetchMessages();
      fetchSessions();
    }, 5000); // Refresh every 5 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, [department]);  // Only depend on department, not messageText

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/cad/dispatcher/bookmarks?userId=${currentUserId}`);
      if (response.ok) {
        const { bookmarks } = await response.json();
        setBookmarkedMessages(bookmarks.map((b: any) => b.messageId));
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/cad/dispatcher/templates?userId=${currentUserId}&department=${department}`);
      if (response.ok) {
        const { templates } = await response.json();
        setSavedTemplates(templates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  // Typing indicator effect
  useEffect(() => {
    if (messageText) {
      // Simulate sending typing status to server
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing after 3 seconds of inactivity
      }, 3000);
    }
  }, [messageText]);
  
  useEffect(() => {
    scrollToBottom();
    
    // Play sound notification for new messages
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0 && playSound && !dndMode) {
      const newMessages = messages.slice(prevMessageCountRef.current);
      const hasNewMessageForMe = newMessages.some(m => 
        (m.toUserId === currentUserId || !m.toUserId) && m.fromUserId !== currentUserId
      );
      
      if (hasNewMessageForMe) {
        playMessageSound();
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, playSound]);

  const playMessageSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCp+zfDek0IJFV608uypWBQKRKDf8L' );
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      console.log('Could not play sound');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSessions = async () => {
    try {
      const url = department 
        ? `/api/cad/dispatcher/sessions?department=${department}`
        : "/api/cad/dispatcher/sessions";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch dispatcher sessions:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const url = department 
        ? `/api/cad/dispatcher/messages?department=${department}`
        : "/api/cad/dispatcher/messages";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      // Process quick codes
      let processedText = processQuickCode(messageText);
      
      // Detect mentions
      const mentions = detectMentions(processedText);
      
      // Auto-categorize based on keywords
      let autoCategory = selectedCategory;
      if (!autoCategory) {
        if (processedText.toLowerCase().includes("traffic") || processedText.toLowerCase().includes("10-")) {
          autoCategory = "traffic";
        } else if (processedText.toLowerCase().includes("medical") || processedText.toLowerCase().includes("ambulance")) {
          autoCategory = "medical";
        } else if (processedText.toLowerCase().includes("fire") || processedText.toLowerCase().includes("smoke")) {
          autoCategory = "fire";
        } else {
          autoCategory = "update";
        }
      }

      const response = await fetch("/api/cad/dispatcher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUserId,
          fromName: callsign || "Dispatcher",
          fromCallsign: callsign,
          toUserId: selectedRecipient,
          message: processedText,
          priority: selectedPriority,
          channel: selectedChannel,
          category: autoCategory,
          mentions: mentions,
          parentId: replyingTo?.id,
          threadId: selectedThread,
          expiresAt: messageExpiry ? new Date(Date.now() + messageExpiry * 24 * 60 * 60 * 1000).toISOString() : undefined,
          department,
        }),
      });

      if (response.ok) {
        setMessageText("");
        setAttachmentPreview(null);
        setReplyingTo(null);
        setSelectedCategory(null);
        fetchMessages();
        
        // Notify mentioned users
        if (mentions.length > 0) {
          toast.success(`Message sent, mentioned: ${mentions.join(", ")}`);
        }
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/cad/dispatcher/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "BREAK":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "danger";
      case "HIGH":
        return "warning";
      default:
        return "default";
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return "bg-blue-500";
      case "FIRE":
        return "bg-red-500";
      case "EMS":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return { color: "primary" as const, text: "POL" };
      case "FIRE":
        return { color: "danger" as const, text: "FIRE" };
      case "EMS":
        return { color: "success" as const, text: "EMS" };
      default:
        return { color: "default" as const, text: "N/A" };
    }
  };
  
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/cad/dispatcher/messages/${messageId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, userId: currentUserId, userName: "Dispatcher" }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };
  
  const togglePin = async (messageId: string) => {
    try {
      const msg = messages.find(m => m.id === messageId);
      await fetch(`/api/cad/dispatcher/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !msg?.isPinned }),
      });
      fetchMessages();
      toast.success(msg?.isPinned ? "Message unpinned" : "Message pinned");
    } catch (error) {
      toast.error("Failed to toggle pin");
    }
  };
  
  const deleteMessage = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/cad/dispatcher/messages/${messageId}`, {
        method: "DELETE",
      });
      fetchMessages();
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };
  
  const startEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.message);
  };
  
  const saveEdit = async () => {
    if (!editingMessageId || !editingText.trim()) return;
    try {
      await fetch(`/api/cad/dispatcher/messages/${editingMessageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editingText }),
      });
      setEditingMessageId(null);
      setEditingText("");
      fetchMessages();
      toast.success("Message updated");
    } catch (error) {
      toast.error("Failed to update message");
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setAttachmentPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    
    // TODO: Upload file to server and get URL
    toast.success("File attached (upload implementation needed)");
  };
  
  const exportChat = () => {
    const chatText = messages.map(m => 
      `[${new Date(m.createdAt).toLocaleString()}] ${m.fromName}: ${m.message}`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispatcher-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat exported");
  };

  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const unreadCount = messages.filter((m) => !m.isRead && m.toUserId === currentUserId).length;
  
  // Filter messages based on PM view, search, and pinned
  let filteredMessages = messages;
  
  // Debug: Log channel distribution
  if (messages.length > 0 && selectedChannel) {
    const channelCounts = messages.reduce((acc: Record<string, number>, m) => {
      const ch = m.channel || 'no-channel';
      acc[ch] = (acc[ch] || 0) + 1;
      return acc;
    }, {});
    console.log('📊 Message channel distribution:', channelCounts);
    console.log('🔍 Filtering for channel:', selectedChannel);
  }
  
  // Filter by channel - show all messages if they don't have a channel property or match selected channel
  if (selectedChannel) {
    filteredMessages = filteredMessages.filter((m) => 
      !m.channel || m.channel === selectedChannel
    );
    console.log(`✅ After channel filter: ${filteredMessages.length} of ${messages.length} messages`);
  }
  
  // Filter by category
  if (selectedCategory) {
    filteredMessages = filteredMessages.filter((m) => 
      m.category === selectedCategory
    );
  }
  
  if (showPMOnly) {
    filteredMessages = filteredMessages.filter((m) => 
      m.toUserId === currentUserId || m.fromUserId === currentUserId
    );
  }
  
  if (showPinnedOnly) {
    filteredMessages = filteredMessages.filter((m) => m.isPinned);
  }
  
  if (searchQuery) {
    filteredMessages = filteredMessages.filter((m) =>
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.callNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  const pmCount = messages.filter((m) => 
    (m.toUserId === currentUserId || m.fromUserId === currentUserId) && m.toUserId !== undefined
  ).length;
  
  const pinnedCount = messages.filter(m => m.isPinned).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Online Dispatchers */}
      <Card className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 shadow-xl h-full overflow-y-auto">
        <CardHeader className="flex items-center gap-3 pb-4 border-b border-gray-800/50">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">Online Dispatchers</h3>
            <p className="text-xs text-gray-400 font-medium">
              {activeSessions.length} active dispatcher{activeSessions.length !== 1 ? 's' : ''}
              {department && (
                <span className="ml-1 text-xs">• {getDepartmentBadge(department).text}</span>
              )}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">No active dispatchers</p>
              </div>
            ) : (
              activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedRecipient === session.userId
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/20"
                      : "bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/60 hover:border-gray-700/50 hover:shadow-md"
                  }`}
                  onClick={() =>
                    setSelectedRecipient(
                      selectedRecipient === session.userId ? null : session.userId
                    )
                  }
                >
                  <div className="relative">
                    <Avatar
                      name={session.name}
                      size="sm"
                      className="w-10 h-10"
                      color={getStatusColor(session.status)}
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      session.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-500"
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {session.callsign && (
                        <Chip
                          size="sm"
                          color={getDepartmentBadge(session.department).color}
                          variant="solid"
                          className="font-bold text-xs"
                        >
                          {session.callsign}
                        </Chip>
                      )}
                      <p className="text-sm font-semibold text-white truncate">{session.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {session.department && (
                        <Chip
                          size="sm"
                          color={getDepartmentBadge(session.department).color}
                          variant="flat"
                          className="font-bold text-[10px] px-1.5"
                        >
                          {getDepartmentBadge(session.department).text}
                        </Chip>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(session.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {selectedRecipient === session.userId && (
                    <Chip size="sm" color="primary" variant="flat" className="font-semibold">
                      DM
                    </Chip>
                  )}
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-3 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800/50 shadow-2xl h-full flex flex-col">
        <CardHeader className="flex items-center justify-between pb-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Dispatcher Chat</h3>
              <p className="text-xs text-gray-400 font-medium">
                {selectedRecipient ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                    Direct Message • {sessions.find((s) => s.userId === selectedRecipient)?.callsign || ""} {sessions.find((s) => s.userId === selectedRecipient)?.name}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Broadcasting to all dispatchers
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              className="w-56"
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 shadow-sm"
              }}
              startContent={<span className="text-sm">🔍</span>}
            />
            <Button
              size="sm"
              variant={showPinnedOnly ? "solid" : "flat"}
              color="warning"
              onPress={() => setShowPinnedOnly(!showPinnedOnly)}
              isIconOnly
              title="Show pinned only"
              className="shadow-sm"
            >
              📌
            </Button>
            <Button
              size="sm"
              variant={showPMOnly ? "solid" : "flat"}
              color="secondary"
              onPress={() => setShowPMOnly(!showPMOnly)}
              className="font-semibold shadow-sm"
            >
              {showPMOnly ? `PMs (${pmCount})` : "All"}
            </Button>
            <Button
              size="sm"
              variant={dndMode ? "solid" : "flat"}
              color={dndMode ? "danger" : "default"}
              onPress={() => setDndMode(!dndMode)}
              isIconOnly
              title="Do Not Disturb"
            >
              {dndMode ? "🔕" : "🔔"}
            </Button>
            <Button
              size="sm"
              variant="flat"
              onPress={toggleTheme}
              isIconOnly
              title="Toggle Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
            <Button
              size="sm"
              variant={highContrast ? "solid" : "flat"}
              color={highContrast ? "primary" : "default"}
              onPress={toggleHighContrast}
              isIconOnly
              title="High Contrast Mode"
            >
              ♿
            </Button>
            <Button
              size="sm"
              variant={bookmarkedMessages.length > 0 ? "solid" : "flat"}
              color="warning"
              onPress={() => {
                if (bookmarkedMessages.length > 0) {
                  // Show bookmarked messages
                  setSearchQuery("");
                  toast.success(`${bookmarkedMessages.length} bookmarked messages`);
                } else {
                  toast.error("No bookmarked messages");
                }
              }}
              isIconOnly
              title={`Bookmarks (${bookmarkedMessages.length})`}
            >
              ⭐
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat" isIconOnly>
                  ⚙️
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="export" onPress={exportChat}>
                  📥 Export Chat
                </DropdownItem>
                <DropdownItem key="sound" onPress={() => setPlaySound(!playSound)}>
                  {playSound ? "🔇" : "🔊"} Toggle Sound
                </DropdownItem>
                <DropdownItem key="threads" onPress={() => setShowThreads(!showThreads)}>
                  💬 {showThreads ? "Hide" : "Show"} Threads
                </DropdownItem>
                <DropdownItem key="shortcuts" onPress={() => toast.success("Shortcuts: Ctrl+Enter=Send, @=Mention, /=QuickCode, #=CallLink")}>
                  ⌨️ Keyboard Shortcuts
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            {unreadCount > 0 && (
              <Chip size="sm" color="danger" variant="solid" className="animate-pulse font-bold">
                {unreadCount}
              </Chip>
            )}
          </div>
        </CardHeader>
        <CardBody className="flex flex-col h-full">
          {/* Channel & Category Selectors - Fixed at top */}
          <div className="flex-shrink-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/95 px-4 py-3 mb-3 border-b border-gray-800/50 backdrop-blur-sm shadow-lg">
            {/* Channel Selector Tabs */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Channel:</span>
              {channels.map(channel => {
                const channelMsgCount = messages.filter(m => m.channel === channel.id).length;
                const totalMsgCount = messages.length;
                const isActive = selectedChannel === channel.id;
                return (
                  <Button
                    key={channel.id}
                    size="sm"
                    variant={isActive ? "solid" : "flat"}
                    color={isActive ? "primary" : "default"}
                    onPress={() => {
                      console.log('Switching channel from', selectedChannel, 'to', channel.id);
                      setSelectedChannel(channel.id);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('dispatcher-selected-channel', channel.id);
                      }
                      toast.success(`Switched to ${channel.name} (${channelMsgCount} msgs)`);
                    }}
                    className={`text-xs h-7 min-w-0 px-3 font-medium transition-all ${
                      isActive ? "shadow-lg shadow-blue-500/30" : ""
                    }`}
                  >
                    <span className="mr-1">{channel.icon}</span> {channel.name}
                    {isActive ? (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-blue-700 rounded-full text-[10px] font-bold">{channelMsgCount}</span>
                    ) : channelMsgCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]">{channelMsgCount}</span>
                    )}
                  </Button>
                );
              })}
              <span className="text-[10px] text-gray-500 ml-2">
                Showing: {filteredMessages.length} / {messages.length}
              </span>
              {(selectedCategory || selectedChannel !== "general") && (
                <Button
                  size="sm"
                  variant="flat"
                  color="warning"
                  className="h-7 text-[10px] px-2 ml-2"
                  onPress={() => {
                    setSelectedChannel("general");
                    setSelectedCategory(null);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('dispatcher-selected-channel', 'general');
                    }
                    toast.success("Filters cleared");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            {/* Category Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Category:</span>
              {categories.map(cat => {
                const catMsgCount = messages.filter(m => m.category === cat.id).length;
                return (
                  <Button
                    key={cat.id}
                    size="sm"
                    variant={selectedCategory === cat.id ? "solid" : "flat"}
                    color={selectedCategory === cat.id ? (cat.color as any) : "default"}
                    onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`text-xs h-7 min-w-0 px-3 font-medium transition-all ${
                      selectedCategory === cat.id ? "shadow-md" : ""
                    }`}
                  >
                    {cat.name}
                    {catMsgCount > 0 && selectedCategory !== cat.id && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]">{catMsgCount}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="space-y-3 pr-2 pb-3 px-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {showPMOnly ? "No private messages" : selectedCategory ? `No ${selectedCategory} messages` : "No messages yet"}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {showPMOnly ? "Send a PM to start" : selectedCategory ? `Switch category or send a ${selectedCategory} message` : "Start the conversation by sending a message below"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isOwn = msg.fromUserId === currentUserId;
                  const isBroadcast = !msg.toUserId;
                  const isEditing = editingMessageId === msg.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
                    >
                      <div
                        className={`max-w-[70%] relative ${
                          isOwn
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400/40 shadow-xl"
                            : "bg-gray-800 border-2 border-gray-600/60 shadow-lg"
                        } ${msg.isPinned ? "ring-2 ring-yellow-400/50" : ""} rounded-xl p-4 backdrop-blur-sm hover:shadow-2xl transition-shadow`}
                        onClick={() => !isOwn && !msg.isRead && markAsRead(msg.id)}
                      >
                        {msg.isPinned && (
                          <div className="absolute -top-2 -left-2 bg-yellow-500 rounded-full p-1">
                            <span className="text-xs">📌</span>
                          </div>
                        )}
                        
                        {/* Action buttons (show on hover) */}
                        <div className="absolute -top-2 right-2 hidden group-hover:flex gap-1 bg-gray-900 rounded-full p-1 border border-gray-700">
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="w-6 h-6 min-w-6"
                            onPress={() => addReaction(msg.id, "👍")}
                            title="React"
                          >
                            👍
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="w-6 h-6 min-w-6"
                            onPress={() => startThread(msg.id)}
                            title="Start Thread"
                          >
                            💬
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="w-6 h-6 min-w-6"
                            onPress={() => {
                              setReplyingTo(msg);
                              toast.success("Replying to message");
                            }}
                            title="Reply"
                          >
                            ↩️
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="w-6 h-6 min-w-6"
                            onPress={() => toggleBookmark(msg.id)}
                            title={bookmarkedMessages.includes(msg.id) ? "Remove Bookmark" : "Bookmark"}
                          >
                            {bookmarkedMessages.includes(msg.id) ? "⭐" : "☆"}
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="w-6 h-6 min-w-6"
                            onPress={() => togglePin(msg.id)}
                            title="Pin"
                          >
                            📌
                          </Button>
                          {isOwn && (
                            <>
                              <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                className="w-6 h-6 min-w-6"
                                onPress={() => {
                                  const name = prompt("Template name:");
                                  if (name) saveAsTemplate(msg, name);
                                }}
                                title="Save as Template"
                              >
                                💾
                              </Button>
                              <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                className="w-6 h-6 min-w-6"
                                onPress={() => startEdit(msg)}
                                title="Edit"
                              >
                                ✏️
                              </Button>
                              <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                className="w-6 h-6 min-w-6"
                                onPress={() => deleteMessage(msg.id)}
                                title="Delete"
                              >
                                🗑️
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          {msg.fromCallsign && (
                            <Chip
                              size="sm"
                              color={msg.fromDepartment ? getDepartmentBadge(msg.fromDepartment).color : "default"}
                              variant="solid"
                              className="font-bold text-[10px] h-5"
                            >
                              {msg.fromCallsign}
                            </Chip>
                          )}
                          <p className="text-sm font-bold text-white">{msg.fromName}</p>
                          {msg.fromDepartment && (
                            <Chip
                              size="sm"
                              color={getDepartmentBadge(msg.fromDepartment).color}
                              variant="dot"
                              className="font-bold text-[10px]"
                            >
                              {getDepartmentBadge(msg.fromDepartment).text}
                            </Chip>
                          )}
                          {msg.channel && (
                            <Chip
                              size="sm"
                              color="default"
                              variant="bordered"
                              className="font-bold text-[10px] h-5"
                            >
                              {channels.find(ch => ch.id === msg.channel)?.icon || "💬"} {channels.find(ch => ch.id === msg.channel)?.name || msg.channel}
                            </Chip>
                          )}
                          {msg.priority !== "NORMAL" && (
                            <Chip size="sm" color={getPriorityColor(msg.priority)} variant="flat" className="font-semibold">
                              {msg.priority}
                            </Chip>
                          )}
                          {isBroadcast && (
                            <Chip size="sm" color="warning" variant="flat" className="font-semibold">
                              BROADCAST
                            </Chip>
                          )}
                          {msg.toName && !isBroadcast && (
                            <Chip size="sm" color="secondary" variant="flat" className="font-semibold text-[10px]">
                              → {msg.toCallsign ? `${msg.toCallsign} ` : ""}{msg.toName}
                            </Chip>
                          )}
                          {!isOwn && !msg.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              size="sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" color="primary" onPress={saveEdit}>
                                Save
                              </Button>
                              <Button size="sm" variant="flat" onPress={() => setEditingMessageId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-base font-medium text-white mb-2 leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                            
                            {msg.callNumber && (
                              <Chip
                                size="sm"
                                color="primary"
                                variant="bordered"
                                className="mb-1.5"
                              >
                                🚨 {msg.callNumber}
                              </Chip>
                            )}
                            
                            {msg.location && (
                              <p className="text-xs text-white/80 mb-1.5">
                                📍 {msg.location}
                              </p>
                            )}
                            
                            {msg.attachmentUrl && (
                              <div className="mt-2 mb-1.5">
                                {msg.attachmentType?.startsWith('image/') ? (
                                  <img src={msg.attachmentUrl} alt="Attachment" className="max-w-xs rounded" />
                                ) : (
                                  <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline text-xs">
                                    📎 View attachment
                                  </a>
                                )}
                              </div>
                            )}
                            
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex gap-1 mb-1.5 flex-wrap">
                                {msg.reactions.map((r, idx) => (
                                  <Chip key={idx} size="sm" variant="flat" className="text-xs">
                                    {r.emoji} {r.userName}
                                  </Chip>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 font-medium">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                            {msg.editedAt && <span className="ml-1">(edited)</span>}
                          </p>
                          {isOwn && (
                            <span className="text-xs text-white/70" title={msg.isRead ? "Read" : "Sent"}>
                              {msg.isRead ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="flex-shrink-0 space-y-2 mt-3 px-4">
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="text-xs text-gray-400 italic px-2">
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
            
            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                {quickReplies.map((reply, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="flat"
                    className="text-xs"
                    onPress={() => {
                      setMessageText(reply);
                      setShowQuickReplies(false);
                    }}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Attachment Preview */}
            {attachmentPreview && (
              <div className="relative inline-block p-2 bg-gray-800/50 rounded-lg">
                <img src={attachmentPreview} alt="Preview" className="h-20 rounded" />
                <Button
                  size="sm"
                  isIconOnly
                  className="absolute -top-2 -right-2"
                  onPress={() => setAttachmentPreview(null)}
                >
                  ❌
                </Button>
              </div>
            )}
            
            {selectedRecipient && (
              <div className="flex items-center justify-between p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <p className="text-xs text-indigo-300">
                  📨 Sending to: <span className="font-bold">{sessions.find((s) => s.userId === selectedRecipient)?.callsign || ""} {sessions.find((s) => s.userId === selectedRecipient)?.name}</span>
                </p>
                <Button
                  size="sm"
                  variant="light"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                  onPress={() => setSelectedRecipient(null)}
                >
                  Clear
                </Button>
              </div>
            )}
            
            {/* Reply Context */}
            {replyingTo && (
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/40 rounded-xl px-4 py-3 mb-3 flex items-start justify-between shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                <div className="flex-1">
                  <p className="text-xs text-blue-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <span className="text-sm">↩️</span>
                    Replying to {replyingTo.fromName}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2 italic">{replyingTo.message}</p>
                </div>
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  onPress={() => setReplyingTo(null)}
                  className="text-blue-400 hover:bg-blue-500/20"
                >
                  ✕
                </Button>
              </div>
            )}
            
            {/* Templates Panel */}
            {showTemplates && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">Message Templates</h4>
                  <Button size="sm" variant="light" onPress={() => setShowTemplates(false)}>✕</Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedTemplates.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No templates saved yet</p>
                  ) : (
                    savedTemplates.map(template => (
                      <div
                        key={template.id}
                        className="flex items-start justify-between gap-2 p-2 bg-gray-900/50 rounded hover:bg-gray-900 cursor-pointer"
                        onClick={() => applyTemplate(template)}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-white">{template.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-2">{template.text}</p>
                        </div>
                        <Chip size="sm" color={categories.find(c => c.id === template.category)?.color as any}>
                          {template.category}
                        </Chip>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Mention Autocomplete */}
            {showMentions && mentionSuggestions.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mb-3 shadow-xl">
                <div className="space-y-1">
                  {mentionSuggestions.map((user, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-700 rounded cursor-pointer transition"
                      onClick={() => insertMention(user)}
                    >
                      <p className="text-sm text-white">@{user}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 p-2 bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/50 shadow-inner">
              <Button
                size="md"
                variant="flat"
                color={showQuickReplies ? "primary" : "default"}
                onPress={() => setShowQuickReplies(!showQuickReplies)}
                isIconOnly
                title="Quick Replies"
                className="w-9 h-9 min-w-9 text-lg"
              >
                ⚡
              </Button>
              <Button
                size="md"
                variant="flat"
                color={showTemplates ? "primary" : "default"}
                onPress={() => setShowTemplates(!showTemplates)}
                isIconOnly
                title="Templates"
                className="w-9 h-9 min-w-9 text-lg"
              >
                📝
              </Button>
              <Button
                size="md"
                variant="flat"
                color={voiceEnabled ? "danger" : "default"}
                onPress={startVoiceInput}
                isIconOnly
                title="Voice Input"
                className="w-9 h-9 min-w-9 text-lg"
              >
                {voiceEnabled ? "🎤" : "🎙️"}
              </Button>
              <Button
                size="md"
                variant="flat"
                onPress={() => setShowGifPicker(!showGifPicker)}
                isIconOnly
                title="Add GIF"
                className="w-9 h-9 min-w-9 text-lg"
              >
                🎞️
              </Button>
              <Button
                size="md"
                variant="flat"
                onPress={() => fileInputRef.current?.click()}
                isIconOnly
                title="Attach File"
                className="w-9 h-9 min-w-9 text-lg"
              >
                📎
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload attachment"
              />
              <div className="flex-1">
                <Input
                  placeholder={
                    selectedRecipient
                      ? "Type direct message... (@mention, /code, #call)"
                      : "Type to broadcast... (@mention, /code, #call)"
                  }
                  value={messageText}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setMessageText(newText);
                    updateMentionSuggestions(newText);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  size="md"
                  classNames={{
                    input: "text-sm font-medium bg-gray-800/50 text-white placeholder:text-gray-400",
                    inputWrapper: "h-10 bg-gray-800/50 border-2 border-gray-600 hover:bg-gray-800 hover:border-gray-500 focus-within:border-blue-400 focus-within:bg-gray-800",
                  }}
                  endContent={
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          size="sm"
                          variant="flat"
                          color={getPriorityColor(selectedPriority)}
                          className="font-semibold text-[11px] h-7 min-w-0 px-2"
                        >
                          {selectedPriority}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        selectedKeys={[selectedPriority]}
                        onSelectionChange={(keys) =>
                          setSelectedPriority(Array.from(keys)[0] as string)
                        }
                        className="min-w-[120px]"
                      >
                        <DropdownItem key="NORMAL">NORMAL</DropdownItem>
                        <DropdownItem key="HIGH">HIGH</DropdownItem>
                        <DropdownItem key="URGENT">URGENT</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  }
                />
              </div>
              <Button 
                color="primary" 
                onPress={sendMessage} 
                isIconOnly 
                size="md"
                className="w-10 h-10 min-w-10 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/40"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
