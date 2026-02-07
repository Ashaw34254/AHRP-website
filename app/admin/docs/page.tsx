// @ts-nocheck
"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  BookOpen, 
  FileText, 
  ArrowRight, 
  Download, 
  Radio,
  Database,
  Users,
  Gamepad2,
  Code,
  Settings,
  AlertCircle,
  BarChart3,
  User,
  Shield,
  Wrench,
  Search,
  Star,
  Filter,
  Clock,
  TrendingUp,
  Eye,
  Link2,
  CheckCircle2,
  Calendar,
  Zap,
  BarChart2,
  Grid3x3,
  List,
  Share2,
  Copy,
  ExternalLink,
  ChevronDown,
  SortAsc,
  LayoutGrid,
  FileDown,
  Printer,
  StickyNote,
  Percent,
  Bell,
  Sparkles,
  MessageSquare,
  Edit3,
  Save,
  X,
  Info
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "@/lib/toast";
import { Card, CardBody, CardHeader, Button, Input, Chip, Select, SelectItem, Kbd } from "@heroui/react";

type ViewMode = "user" | "staff" | "dev";
type LayoutMode = "grid" | "list";
type SortMode = "newest" | "popular" | "alphabetical" | "recent";

export default function AdminDocsIndexPage() {
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>("staff");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docFavorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [readDocs, setReadDocs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docReadStatus");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docRecentlyViewed");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [docViews, setDocViews] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docViewCounts");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("alphabetical");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Reading Progress State (percentage per document)
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docReadingProgress");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Personal Notes State
  const [docNotes, setDocNotes] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("docNotes");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  
  // Hover Preview State
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("doc-search")?.focus();
      }
      // / for search
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        document.getElementById("doc-search")?.focus();
      }
      // Esc to clear filters
      if (e.key === "Escape") {
        setSearchQuery("");
        setSelectedTags([]);
        setShowFavoritesOnly(false);
        setShowUnreadOnly(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle favorite
  const toggleFavorite = (docTitle: string) => {
    const newFavorites = favorites.includes(docTitle)
      ? favorites.filter(f => f !== docTitle)
      : [...favorites, docTitle];
    setFavorites(newFavorites);
    if (typeof window !== "undefined") {
      localStorage.setItem("docFavorites", JSON.stringify(newFavorites));
    }
    toast.success(favorites.includes(docTitle) ? "Removed from favorites" : "Added to favorites");
  };

  // Toggle read status
  const toggleReadStatus = (docTitle: string) => {
    const newReadDocs = readDocs.includes(docTitle)
      ? readDocs.filter(d => d !== docTitle)
      : [...readDocs, docTitle];
    setReadDocs(newReadDocs);
    if (typeof window !== "undefined") {
      localStorage.setItem("docReadStatus", JSON.stringify(newReadDocs));
    }
  };

  // Track document view
  const trackDocView = (docTitle: string) => {
    // Update view count
    const newViewCounts = { ...docViews, [docTitle]: (docViews[docTitle] || 0) + 1 };
    setDocViews(newViewCounts);
    localStorage.setItem("docViewCounts", JSON.stringify(newViewCounts));

    // Update recently viewed
    const newRecent = [docTitle, ...recentlyViewed.filter(t => t !== docTitle)].slice(0, 5);
    setRecentlyViewed(newRecent);
    localStorage.setItem("docRecentlyViewed", JSON.stringify(newRecent));
  };

  // Copy link to clipboard
  const copyLink = (href: string) => {
    const fullUrl = `${window.location.origin}${href}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard!");
  };

  // Download all docs in category
  const downloadCategory = (categoryName: string) => {
    const category = docCategories.find(c => c.name === categoryName);
    if (!category) return;
    
    category.docs.forEach(doc => {
      const link = document.createElement("a");
      link.href = doc.downloadUrl;
      link.download = "";
      link.click();
    });
    toast.success(`Downloading ${category.docs.length} documents from ${categoryName}`);
  };
  
  // Update reading progress
  const updateProgress = (docTitle: string, percentage: number) => {
    const newProgress = { ...readingProgress, [docTitle]: percentage };
    setReadingProgress(newProgress);
    localStorage.setItem("docReadingProgress", JSON.stringify(newProgress));
    
    // Auto-mark as read at 90%+
    if (percentage >= 90 && !readDocs.includes(docTitle)) {
      toggleReadStatus(docTitle);
    }
  };
  
  // Save note for document
  const saveNote = (docTitle: string, note: string) => {
    const newNotes = { ...docNotes, [docTitle]: note };
    setDocNotes(newNotes);
    localStorage.setItem("docNotes", JSON.stringify(newNotes));
    setEditingNote(null);
    setNoteText("");
    toast.success("Note saved!");
  };
  
  // Delete note
  const deleteNote = (docTitle: string) => {
    const newNotes = { ...docNotes };
    delete newNotes[docTitle];
    setDocNotes(newNotes);
    localStorage.setItem("docNotes", JSON.stringify(newNotes));
    toast.success("Note deleted");
  };
  
  // Get related documents based on tags
  const getRelatedDocs = (currentDoc: any, limit = 3) => {
    const allDocs = docCategories.flatMap(cat => cat.docs);
    const currentTags = currentDoc.tags || [];
    
    return allDocs
      .filter(doc => doc.title !== currentDoc.title)
      .map(doc => ({
        ...doc,
        matchScore: (doc.tags || []).filter((tag: string) => currentTags.includes(tag)).length
      }))
      .filter(doc => doc.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  };
  
  // Print document
  const printDoc = (docTitle: string) => {
    toast.success(`Opening print dialog for: ${docTitle}`);
    window.print();
  };
  
  // Export to PDF (simulated)
  const exportToPDF = (docTitle: string) => {
    toast.success(`Generating PDF for: ${docTitle}...`);
    // In real implementation, would use library like jsPDF or html2pdf
  };

  // Define which categories are visible for each mode
  const categoryAccess: Record<ViewMode, string[]> = {
    user: ["CAD System", "Character & Personnel", "Project Info"],
    staff: ["Error System", "CAD System", "Database & Data", "Character & Personnel", "Features & Systems", "Project Info"],
    dev: ["Error System", "CAD System", "Database & Data", "Character & Personnel", "FiveM Integration", "Development Guides", "Features & Systems", "Project Info"]
  };

  const docCategories = [
    {
      name: "Error System",
      icon: AlertCircle,
      color: "from-red-500 to-pink-500",
      docs: [
        {
          title: "Error System Overview",
          description: "Complete overview of the error handling system including what was built, quick start guide, error categories, and severity levels.",
          href: "/admin/docs/error-system",
          downloadUrl: "/docs/ERROR-SYSTEM-SUMMARY.md",
          tags: ["Overview", "Quick Start"],
          readingTime: 5,
          difficulty: "Beginner",
          lastUpdated: "2024-12-20"
        },
        {
          title: "Error Handling Guide",
          description: "Comprehensive usage documentation with code examples, best practices, and debugging tips for implementing error handling.",
          href: "/admin/docs/error-guide",
          downloadUrl: "/docs/ERROR-HANDLING-GUIDE.md",
          tags: ["Guide", "Best Practices"],
          readingTime: 8,
          difficulty: "Intermediate",
          lastUpdated: "2024-12-20"
        },
        {
          title: "Quick Reference",
          description: "Fast access to error handling essentials with quick code snippets, common scenarios, and interactive testing checklist.",
          href: "/admin/docs/error-quick",
          downloadUrl: "/docs/README-ERRORS.md",
          tags: ["Reference", "Quick Start"]
        },
        {
          title: "Visual Guide",
          description: "Visual examples and UI previews showing error pages, dashboard layouts, color schemes, and before/after comparisons.",
          href: "/admin/docs/error-visual",
          downloadUrl: "/docs/ERROR-VISUAL-GUIDE.md",
          tags: ["Visual", "UI/UX"]
        }
      ]
    },
    {
      name: "CAD System",
      icon: Radio,
      color: "from-blue-500 to-cyan-500",
      docs: [
        {
          title: "CAD System Complete Guide",
          description: "Comprehensive documentation for the Computer-Aided Dispatch system including dispatch console, unit management, and call tracking.",
          href: "/admin/docs/cad-system",
          downloadUrl: "/docs/CAD-README.md",
          tags: ["Complete Guide", "CAD"]
        },
        {
          title: "CAD Dispatch System",
          description: "Detailed documentation for the dispatch console, call management, unit assignment, and real-time operations.",
          href: "/admin/docs/cad-dispatch",
          downloadUrl: "/docs/CAD-DISPATCH-SYSTEM.md",
          tags: ["Dispatch", "Operations"]
        },
        {
          title: "Victoria CAD Terminology",
          description: "Police codes, radio terminology, and CAD-specific language reference for law enforcement operations.",
          href: "/admin/docs/cad-terminology",
          downloadUrl: "/docs/VICTORIA-CAD-TERMINOLOGY.md",
          tags: ["Reference", "Terminology"]
        },
        {
          title: "Voice Alerts Guide",
          description: "Text-to-speech voice alert system for CAD notifications including configuration, voice profiles, and alert types.",
          href: "/admin/docs/voice-alerts",
          downloadUrl: "/docs/VOICE-ALERTS-GUIDE.md",
          tags: ["Voice", "Alerts"]
        }
      ]
    },
    {
      name: "Database & Data",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      docs: [
        {
          title: "Database Complete Reference",
          description: "Complete database schema documentation including all models, relationships, and field definitions for the entire system.",
          href: "/admin/docs/database-complete",
          downloadUrl: "/docs/DATABASE-COMPLETE.md",
          tags: ["Schema", "Reference"]
        },
        {
          title: "Database Integration Guide",
          description: "Guide for integrating with the database including Prisma usage patterns, query examples, and best practices.",
          href: "/admin/docs/database-integration",
          downloadUrl: "/docs/DATABASE-INTEGRATION.md",
          tags: ["Integration", "Guide"]
        }
      ]
    },
    {
      name: "Character & Personnel",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      docs: [
        {
          href: "/admin/docs/character-police-data",
          downloadUrl: "/docs/CHARACTER-POLICE-DATA.md",
          tags: ["Characters", "Police"]
        },
        {
          title: "Character Police Setup",
          description: "Setup guide for implementing police character profiles with rank structure, departments, and certifications.",
          href: "/admin/docs/character-police-setup",
          downloadUrl: "/docs/CHARACTER-POLICE-SETUP.md",
          tags: ["Setup", "Configuration"]
        },
        {
          title: "Character Police Implementation",
          description: "Complete implementation details for the character-police integration including data models and API endpoints.",
          href: "/admin/docs/character-police-implementation",
          downloadUrl: "/docs/CHARACTER-POLICE-IMPLEMENTATION-COMPLETE.md",
          tags: ["Implementation", "Complete"]
        }
      ]
    },
    {
      name: "FiveM Integration",
      icon: Gamepad2,
      color: "from-orange-500 to-red-500",
      docs: [
        {href: "/admin/docs/fivem-integration",
          downloadUrl: "/docs/FIVEM-INTEGRATION.md",
          tags: ["Integration", "FiveM"]
        },
        {
          title: "FiveM API Setup",
          description: "API configuration and authentication setup for FiveM server communication with the web CAD system.",
          href: "/admin/docs/fivem-api-setup",
          downloadUrl: "/docs/API-SETUP.md",
          tags: ["API", "Setup"]
        },
        {
          title: "FiveM Quick Start",
          description: "15-minute quick start guide for installing and configuring the FiveM CAD resource on your server.",
          href: "/admin/docs/fivem-quick-start",
          downloadUrl: "/docs/QUICK-START.md",
          tags: ["Quick Start", "Installation"]
        },
        {
          title: "FiveM Build Summary",
          description: "Summary of FiveM resource structure, scripts, and features including real-time sync and in-game commands.",
          downloadUrl: "/docs/FIVEM-BUILD-SUMMARY.md",
          tags: ["Summary", "Build"]
        },
        {
          title: "WARS2X Integration",
          description: "Integration with WARS2X (Warrants and Records System) for in-game criminal records and warrant management.",
          downloadUrl: "/docs/WARS2X-INTEGRATION-SUMMARY.md",
          tags: ["Warrants", "Records"]
        }
      ]
    },
    {
      name: "Development Guides",
      icon: Code,
      color: "from-indigo-500 to-purple-500",
      docs: [
        {href: "/admin/docs/dev-mode",
          downloadUrl: "/docs/DEV-MODE-GUIDE.md",
          tags: ["Development", "Testing"]
        },
        {
          title: "Department Customization",
          description: "Complete guide for customizing departments including roles, permissions, and department-specific features.",
          href: "/admin/docs/department-customization",
          downloadUrl: "/docs/DEPARTMENT-CUSTOMIZATION-COMPLETE.md",
          tags: ["Departments", "Customization"]
        }
      ]
    },
    {
      name: "Features & Systems",
      icon: Settings,
      color: "from-yellow-500 to-orange-500",
      docs: [
        {
          title: "Final 5 Features",
          description: "Documentation for the five major feature sets including advanced CAD features and system integrations.",
          href: "/admin/docs/final-5-features",
          downloadUrl: "/docs/FINAL-5-FEATURES.md",
          tags: ["Features", "Overview"]
        },
        {
          title: "Tactical Team Management",
          description: "Management system for specialized units including SWAT, K9, and tactical response teams.",
          href: "/admin/docs/tactical-team",
          downloadUrl: "/docs/TACTICAL-TEAM-MANAGEMENT.md",
          tags: ["Tactical", "Teams"]
        },
        {
          title: "Supervisor Dashboard & Alerts",
          description: "Command staff oversight tools with real-time monitoring, alerts, and performance metrics.",
          href: "/admin/docs/supervisor-dashboard",
          downloadUrl: "/docs/SUPERVISOR-DASHBOARD-ALERTS.md",
          tags: ["Supervisor", "Management"]
        },
        {
          title: "Plate Scanner Migration",
          description: "Migration guide for the ALPR (Automatic License Plate Reader) system including data migration and API changes.",
          downloadUrl: "/docs/PLATE-SCAN-MIGRATION.md",
          tags: ["Migration", "ALPR"]
        }
      ]
    },
    {
      name: "Project Info",
      icon: BarChart3,
      color: "from-pink-500 to-rose-500",
      docs: [
        {
          title: "Project Statistics",
          description: "Comprehensive project metrics including lines of code, file counts, component breakdown, and technology stack.",
          href: "/admin/docs/project-stats",
          downloadUrl: "/docs/PROJECT-STATISTICS.md",
          tags: ["Statistics", "Metrics"]
        },
        {
          title: "Documentation Index",
          description: "Master index of all documentation files with descriptions and organization structure.",
          href: "/admin/docs/index-doc",
          downloadUrl: "/docs/INDEX.md",
          tags: ["Index", "Overview"]
        }
      ]
    }
  ];

  // Filter categories based on view mode
  const filteredCategories = docCategories.filter(category => 
    categoryAccess[viewMode].includes(category.name)
  );

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    filteredCategories.forEach(cat => 
      cat.docs.forEach(doc => 
        doc.tags.forEach(tag => tags.add(tag))
      )
    );
    return Array.from(tags).sort();
  }, [filteredCategories]);

  // Filter documents by search and tags
  const filteredDocs = useMemo(() => {
    let result = filteredCategories.map(category => ({
      ...category,
      docs: category.docs.filter(doc => {
        // Search filter
        const matchesSearch = !searchQuery || 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Tag filter
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => doc.tags.includes(tag));
        
        // Favorites filter
        const matchesFavorites = !showFavoritesOnly || favorites.includes(doc.title);

        // Unread filter
        const matchesUnread = !showUnreadOnly || !readDocs.includes(doc.title);

        return matchesSearch && matchesTags && matchesFavorites && matchesUnread;
      })
    })).filter(category => category.docs.length > 0);

    // Sort documents based on sort mode
    result = result.map(category => ({
      ...category,
      docs: [...category.docs].sort((a, b) => {
        switch (sortMode) {
          case "newest":
            return (b.lastUpdated || "").localeCompare(a.lastUpdated || "");
          case "popular":
            return (docViews[b.title] || 0) - (docViews[a.title] || 0);
          case "recent":
            const aIndex = recentlyViewed.indexOf(a.title);
            const bIndex = recentlyViewed.indexOf(b.title);
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          case "alphabetical":
          default:
            return a.title.localeCompare(b.title);
        }
      })
    }));

    return result;
  }, [filteredCategories, searchQuery, selectedTags, showFavoritesOnly, showUnreadOnly, favorites, readDocs, sortMode, docViews, recentlyViewed]);

  // Count visible docs
  const visibleDocsCount = filteredDocs.reduce((sum, cat) => sum + cat.docs.length, 0);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Documentation Center
                </h1>
                <p className="text-gray-400 mt-1">
                  Complete guides, references, and visual examples for the entire system
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "user" ? "solid" : "bordered"}
                color={viewMode === "user" ? "primary" : "default"}
                onPress={() => setViewMode("user")}
                startContent={<User className="w-4 h-4" />}
              >
                User
              </Button>
              <Button
                size="sm"
                variant={viewMode === "staff" ? "solid" : "bordered"}
                color={viewMode === "staff" ? "secondary" : "default"}
                onPress={() => setViewMode("staff")}
                startContent={<Shield className="w-4 h-4" />}
              >
                Staff
              </Button>
              <Button
                size="sm"
                variant={viewMode === "dev" ? "solid" : "bordered"}
                color={viewMode === "dev" ? "success" : "default"}
                onPress={() => setViewMode("dev")}
                startContent={<Wrench className="w-4 h-4" />}
              >
                Dev
              </Button>
            </div>
          </div>

          {/* View Mode Description */}
          <Card className="bg-gray-800/30 border border-gray-700/50">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                {viewMode === "user" && (
                  <>
                    <User className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">User Mode</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Basic documentation for CAD operations, character management, and system overview
                      </p>
                    </div>
                  </>
                )}
                {viewMode === "staff" && (
                  <>
                    <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-400">Staff Mode</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Extended documentation including error handling, database operations, and advanced features
                      </p>
                    </div>
                  </>
                )}
                {viewMode === "dev" && (
                  <>
                    <Wrench className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Developer Mode</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Complete documentation including FiveM integration, development guides, and technical implementation details
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-indigo-400">{filteredCategories.length}</div>
              <div className="text-sm text-gray-400 mt-1">Categories</div>
            </CardBody>
          </Card>
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-green-400">{visibleDocsCount}</div>
              <div className="text-sm text-gray-400 mt-1">Documents</div>
            </CardBody>
          </Card>
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-yellow-400">{visibleDocsCount}</div>
              <div className="text-sm text-gray-400 mt-1">Available Docs</div>
            </CardBody>
          </Card>
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-purple-400">{viewMode.toUpperCase()}</div>
              <div className="text-sm text-gray-400 mt-1">View Mode</div>
            </CardBody>
          </Card>
        </div>
        
        {/* Enhanced Features Stats */}
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 mb-6">
          <CardBody className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">{favorites.length}</span>
                </div>
                <p className="text-xs text-gray-400">Favorites</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400 fill-green-400" />
                  <span className="text-2xl font-bold text-green-400">{readDocs.length}</span>
                </div>
                <p className="text-xs text-gray-400">Read</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <StickyNote className="w-4 h-4 text-yellow-300" />
                  <span className="text-2xl font-bold text-yellow-300">{Object.keys(docNotes).length}</span>
                </div>
                <p className="text-xs text-gray-400">Notes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {Object.keys(readingProgress).length}
                  </span>
                </div>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">{recentlyViewed.length}</span>
                </div>
                <p className="text-xs text-gray-400">Recent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">
                    {Object.values(docViews).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Total Views</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Search and Filter Bar */}
        <Card className="bg-gray-800/50 border border-gray-700 mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col gap-4">
              {/* Top Row: Search + Quick Actions */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <Input
                    id="doc-search"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <div className="flex items-center gap-1">
                        <Kbd keys={["command"]}>K</Kbd>
                      </div>
                    }
                    classNames={{
                      input: "bg-gray-900/50",
                      inputWrapper: "bg-gray-900/50 border border-gray-700"
                    }}
                  />
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={showFavoritesOnly ? "solid" : "bordered"}
                    color={showFavoritesOnly ? "warning" : "default"}
                    onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    startContent={<Star className="w-4 h-4" />}
                  >
                    Favorites ({favorites.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={showUnreadOnly ? "solid" : "bordered"}
                    color={showUnreadOnly ? "primary" : "default"}
                    onPress={() => setShowUnreadOnly(!showUnreadOnly)}
                    startContent={<Eye className="w-4 h-4" />}
                  >
                    Unread
                  </Button>
                </div>
              </div>

              {/* Second Row: Sort, Layout, and Clear */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Sort Dropdown */}
                <Select
                  size="sm"
                  label="Sort by"
                  selectedKeys={[sortMode]}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="w-full md:w-48"
                  startContent={<SortAsc className="w-4 h-4" />}
                >
                  <SelectItem key="alphabetical">Alphabetical</SelectItem>
                  <SelectItem key="newest">Newest First</SelectItem>
                  <SelectItem key="popular">Most Popular</SelectItem>
                  <SelectItem key="recent">Recently Viewed</SelectItem>
                </Select>

                {/* Layout Toggle */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={layoutMode === "grid" ? "solid" : "bordered"}
                    isIconOnly
                    onPress={() => setLayoutMode("grid")}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={layoutMode === "list" ? "solid" : "bordered"}
                    isIconOnly
                    onPress={() => setLayoutMode("list")}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1" />

                {/* Clear Filters */}
                {(searchQuery || selectedTags.length > 0 || showFavoritesOnly || showUnreadOnly) && (
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedTags([]);
                      setShowFavoritesOnly(false);
                      setShowUnreadOnly(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

              {/* Tag Filter Pills */}
              {allTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Filter by tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant={selectedTags.includes(tag) ? "solid" : "bordered"}
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        onClick={() => toggleTag(tag)}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Keyboard Shortcuts Helper */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 mb-6">
          <CardBody className="p-3">
            <div className="flex items-center gap-4 text-xs text-gray-300 flex-wrap">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="font-medium">Keyboard Shortcuts:</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd size="sm">⌘</Kbd>
                <Kbd size="sm">K</Kbd>
                <span className="ml-1">Search</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd size="sm">/</Kbd>
                <span className="ml-1">Quick Search</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd size="sm">Esc</Kbd>
                <span className="ml-1">Clear Filters</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Results Summary */}
        {(searchQuery || selectedTags.length > 0 || showFavoritesOnly) && (
          <Card className="bg-blue-500/10 border border-blue-500/30 mb-6">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">
                  Showing {visibleDocsCount} document{visibleDocsCount !== 1 ? 's' : ''} 
                  {searchQuery && ` matching "${searchQuery}"`}
                  {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
                  {showFavoritesOnly && ` (favorites only)`}
                </span>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Quick Access - Favorites */}
        {favorites.length > 0 && !showFavoritesOnly && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 mb-6">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-300">Quick Access - Your Favorites</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {favorites.slice(0, 4).map(favTitle => {
                  const doc = docCategories
                    .flatMap(cat => cat.docs)
                    .find(d => d.title === favTitle);
                  if (!doc) return null;
                  return (
                    <Link 
                      key={favTitle} 
                      href={doc.href || doc.downloadUrl}
                      onClick={() => trackDocView(doc.title)}
                    >
                      <Card className="bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer">
                        <CardBody className="p-3">
                          <div className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5 fill-yellow-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.title}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <span className="truncate">{doc.tags[0]}</span>
                                {doc.readingTime && (
                                  <>
                                    <span>•</span>
                                    <span>{doc.readingTime} min</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              {favorites.length > 4 && (
                <Button
                  size="sm"
                  variant="light"
                  className="mt-3"
                  onPress={() => setShowFavoritesOnly(true)}
                  endContent={<ArrowRight className="w-3 h-3" />}
                >
                  View all {favorites.length} favorites
                </Button>
              )}
            </CardBody>
          </Card>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && !showFavoritesOnly && (
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 mb-6">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">Recently Viewed</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {recentlyViewed.map(docTitle => {
                  const doc = docCategories
                    .flatMap(cat => cat.docs)
                    .find(d => d.title === docTitle);
                  if (!doc) return null;
                  return (
                    <Link 
                      key={docTitle} 
                      href={doc.href || doc.downloadUrl}
                      onClick={() => trackDocView(doc.title)}
                    >
                      <Card className="bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
                        <CardBody className="p-3">
                          <div className="flex items-start gap-2">
                            <Eye className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{doc.title}</p>
                              {docViews[doc.title] && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {docViews[doc.title]} views
                                </p>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Documentation Categories */}
        <div className="space-y-8">
          {filteredDocs.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.name}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-gradient-to-br ${category.color} rounded-lg`}>
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-gray-400">{category.docs.length} documents</p>
                  </div>
                </div>

                {/* Category Actions */}
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => downloadCategory(category.name)}
                    startContent={<Download className="w-3 h-3" />}
                  >
                    Download All ({category.docs.length})
                  </Button>
                </div>

                {/* Documents Grid/List */}
                <div className={layoutMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
                }>
                  {category.docs.map((doc, index) => (
                    <div 
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setHoveredDoc(doc.title)}
                      onMouseLeave={() => setHoveredDoc(null)}
                    >
                      {/* Hover Preview Tooltip */}
                      {hoveredDoc === doc.title && (
                        <div className="absolute -top-3 left-0 right-0 z-50 pointer-events-none">
                          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-indigo-400/50 rounded-lg shadow-2xl p-3 transform -translate-y-full mb-2 backdrop-blur-sm">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-indigo-200 mb-1">Quick Info</p>
                                <div className="space-y-1 text-xs text-gray-200">
                                  {doc.readingTime && <div>📖 {doc.readingTime} min read</div>}
                                  {favorites.includes(doc.title) && <div>⭐ Favorited</div>}
                                  {readingProgress[doc.title] > 0 && (
                                    <div>✓ {Math.round(readingProgress[doc.title])}% complete</div>
                                  )}
                                  {docNotes[doc.title] && <div>📝 Has notes</div>}
                                  {docViews[doc.title] && <div>👁️ {docViews[doc.title]} views</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    
                    <Card 
                      className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02] relative"
                    >
                      {/* Read Badge */}
                      {readDocs.includes(doc.title) && (
                        <div className="absolute top-2 right-2 z-10">
                          <Chip size="sm" color="success" variant="flat">
                            <CheckCircle2 className="w-3 h-3" />
                          </Chip>
                        </div>
                      )}

                      <CardBody className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold line-clamp-2 flex-1">{doc.title}</h3>
                          <div className="flex gap-1 flex-shrink-0 ml-2">
                            {/* Read Status Toggle */}
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => toggleReadStatus(doc.title)}
                              title={readDocs.includes(doc.title) ? "Mark as unread" : "Mark as read"}
                            >
                              <CheckCircle2 
                                className={`w-4 h-4 ${readDocs.includes(doc.title) ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
                              />
                            </Button>
                            {/* Favorite Toggle */}
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => toggleFavorite(doc.title)}
                              title={favorites.includes(doc.title) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Star 
                                className={`w-4 h-4 ${favorites.includes(doc.title) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                              />
                            </Button>
                            {/* Copy Link */}
                            {doc.href && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => copyLink(doc.href!)}
                                title="Copy link"
                              >
                                <Link2 className="w-4 h-4 text-gray-400" />
                              </Button>
                            )}
                            {/* Download */}
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              as="a"
                              href={doc.downloadUrl}
                              download
                              title="Download Markdown"
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{doc.description}</p>
                        
                        {/* Reading Progress Bar */}
                        {readingProgress[doc.title] > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span className="flex items-center gap-1">
                                <Percent className="w-3 h-3" />
                                Reading Progress
                              </span>
                              <span>{Math.round(readingProgress[doc.title])}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                                style={{ width: `${readingProgress[doc.title]}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Personal Note Preview */}
                        {docNotes[doc.title] && (
                          <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <StickyNote className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-yellow-200 line-clamp-2">{docNotes[doc.title]}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Updated Badge */}
                        {doc.lastUpdated && (() => {
                          const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(doc.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
                          return daysSinceUpdate <= 7 && (
                            <div className="mb-3 inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/40 rounded-md text-xs text-green-300">
                              <Bell className="w-3 h-3" />
                              <span>Updated {daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate}d ago`}</span>
                            </div>
                          );
                        })()}
                        
                        {/* Metadata Row */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                          {doc.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{doc.readingTime} min</span>
                            </div>
                          )}
                          {doc.difficulty && (
                            <Chip 
                              size="sm" 
                              variant="flat"
                              color={
                                doc.difficulty === "Beginner" ? "success" :
                                doc.difficulty === "Intermediate" ? "warning" : "danger"
                              }
                            >
                              {doc.difficulty}
                            </Chip>
                          )}
                          {doc.lastUpdated && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{doc.lastUpdated}</span>
                            </div>
                          )}
                          {docViews[doc.title] && (
                            <div className="flex items-center gap-1">
                              <BarChart2 className="w-3 h-3" />
                              <span>{docViews[doc.title]} views</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {doc.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              size="sm"
                              variant="flat"
                              className="cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>

                        {/* Action Button */}
                        {doc.href ? (
                          <Link href={doc.href} onClick={() => trackDocView(doc.title)}>
                            <Button
                              fullWidth
                              size="sm"
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                              endContent={<ArrowRight className="w-4 h-4" />}
                            >
                              View Page
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            fullWidth
                            size="sm"
                            variant="flat"
                            as="a"
                            href={doc.downloadUrl}
                            target="_blank"
                            endContent={<FileText className="w-4 h-4" />}
                          >
                            View Markdown
                          </Button>
                        )}
                        
                        {/* Extended Features Section */}
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                          {/* Quick Actions Row */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              className="flex-1"
                              startContent={<Printer className="w-3 h-3" />}
                              onPress={() => printDoc(doc.title)}
                            >
                              Print
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              className="flex-1"
                              startContent={<FileDown className="w-3 h-3" />}
                              onPress={() => exportToPDF(doc.title)}
                            >
                              PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              className="flex-1"
                              startContent={<StickyNote className="w-3 h-3" />}
                              onPress={() => {
                                setEditingNote(doc.title);
                                setNoteText(docNotes[doc.title] || "");
                              }}
                            >
                              Note
                            </Button>
                          </div>
                          
                          {/* Progress Slider */}
                          <div className="space-y-2">
                            <label className="text-xs text-gray-400 flex items-center gap-2">
                              <Percent className="w-3 h-3" />
                              Set Reading Progress: {Math.round(readingProgress[doc.title] || 0)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={readingProgress[doc.title] || 0}
                              onChange={(e) => updateProgress(doc.title, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                          </div>
                          
                          {/* Notes Editor */}
                          {editingNote === doc.title && (
                            <div className="space-y-2 p-3 bg-gray-900/50 border border-yellow-500/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-yellow-300 flex items-center gap-1">
                                  <Edit3 className="w-3 h-3" />
                                  Personal Note
                                </span>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => setEditingNote(null)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add your notes about this document..."
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 resize-none focus:outline-none focus:border-yellow-500/50"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  color="warning"
                                  variant="flat"
                                  startContent={<Save className="w-3 h-3" />}
                                  onPress={() => saveNote(doc.title, noteText)}
                                  className="flex-1"
                                >
                                  Save Note
                                </Button>
                                {docNotes[doc.title] && (
                                  <Button
                                    size="sm"
                                    color="danger"
                                    variant="light"
                                    onPress={() => deleteNote(doc.title)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Related Documents */}
                          {getRelatedDocs(doc).length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Sparkles className="w-3 h-3" />
                                <span>Related Documents:</span>
                              </div>
                              <div className="space-y-1">
                                {getRelatedDocs(doc).map((relatedDoc, idx) => (
                                  <Link 
                                    key={idx}
                                    href={relatedDoc.href || relatedDoc.downloadUrl}
                                    onClick={() => trackDocView(relatedDoc.title)}
                                    className="block"
                                  >
                                    <div className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-indigo-500/50 rounded-lg transition-all group">
                                      <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                        <span className="text-xs text-gray-300 group-hover:text-indigo-300 flex-1">
                                          {relatedDoc.title}
                                        </span>
                                        {relatedDoc.tags && relatedDoc.tags[0] && (
                                          <Chip size="sm" variant="flat" className="text-xs">
                                            {relatedDoc.tags[0]}
                                          </Chip>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredDocs.length === 0 && (
            <Card className="bg-gray-800/30 border border-gray-700">
              <CardBody className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-700/30 rounded-full">
                    <Search className="w-12 h-12 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No documents found</h3>
                    <p className="text-gray-400 mb-4">
                      Try adjusting your search query or filters
                    </p>
                    <Button
                      variant="bordered"
                      onPress={() => {
                        setSearchQuery("");
                        setSelectedTags([]);
                        setShowFavoritesOnly(false);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Quick Links */}
        <Card className="mt-8 bg-gray-800/50 border border-gray-700">
          <CardHeader>
            <h2 className="text-2xl font-bold">Quick Access</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/admin/errors">
                <Button
                  fullWidth
                  variant="flat"
                  color="danger"
                  startContent={<AlertCircle className="w-4 h-4" />}
                  className="justify-start"
                >
                  Error Monitoring
                </Button>
              </Link>
              <Link href="/dashboard/police/cad">
                <Button
                  fullWidth
                  variant="flat"
                  color="primary"
                  startContent={<Radio className="w-4 h-4" />}
                  className="justify-start"
                >
                  CAD System
                </Button>
              </Link>
              <a href="/docs/examples/api-error-handling.example.ts" target="_blank">
                <Button
                  fullWidth
                  variant="flat"
                  startContent={<Code className="w-4 h-4" />}
                  className="justify-start"
                >
                  API Examples
                </Button>
              </a>
              <a href="/docs/examples/client-error-handling.example.tsx" target="_blank">
                <Button
                  fullWidth
                  variant="flat"
                  startContent={<Code className="w-4 h-4" />}
                  className="justify-start"
                >
                  Client Examples
                </Button>
              </a>
            </div>
          </CardBody>
        </Card>

        {/* Getting Started */}
        <Card className="mt-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30">
          <CardHeader>
            <h2 className="text-2xl font-bold">📚 How to Use This Documentation</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">For Developers</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">1.</span>
                    <span>Start with <strong>Development Guides</strong> to understand dev mode and testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">2.</span>
                    <span>Read <strong>Database & Data</strong> docs for schema and integration patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">3.</span>
                    <span>Check <strong>Error System</strong> for proper error handling implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">4.</span>
                    <span>Use code examples in /docs/examples/ for reference</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">For Administrators</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">1.</span>
                    <span>Review <strong>CAD System</strong> docs for dispatch operations and terminology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">2.</span>
                    <span>Check <strong>Character & Personnel</strong> for officer management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">3.</span>
                    <span>Read <strong>Department Customization</strong> to configure departments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">4.</span>
                    <span>Use <strong>Project Info</strong> to understand system metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
