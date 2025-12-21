"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Card,
  CardBody,
  Chip,
  Kbd,
} from "@nextui-org/react";
import {
  Search,
  User,
  Car,
  FileText,
  AlertCircle,
  Gavel,
  Heart,
  Radio,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: "citizen" | "vehicle" | "call" | "incident" | "officer" | "court";
  title: string;
  subtitle: string;
  link: string;
  icon: React.ElementType;
  color: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      await performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  async function performSearch(searchQuery: string) {
    setLoading(true);
    try {
      // Search citizens
      const citizenRes = await fetch(`/api/cad/civil/citizen?q=${encodeURIComponent(searchQuery)}`);
      const citizens = citizenRes.ok ? await citizenRes.json() : [];

      // Search vehicles
      const vehicleRes = await fetch(`/api/cad/civil/vehicle?plate=${encodeURIComponent(searchQuery)}`);
      const vehicles = vehicleRes.ok ? await vehicleRes.json() : [];

      // Search calls
      const callsRes = await fetch(`/api/cad/calls?search=${encodeURIComponent(searchQuery)}`);
      const calls = callsRes.ok ? await callsRes.json() : [];

      // Search officers
      const officersRes = await fetch(`/api/cad/officers?search=${encodeURIComponent(searchQuery)}`);
      const officers = officersRes.ok ? await officersRes.json() : [];

      const searchResults: SearchResult[] = [];

      // Add citizens
      citizens.slice(0, 3).forEach((citizen: any) => {
        searchResults.push({
          id: citizen.id,
          type: "citizen",
          title: citizen.name,
          subtitle: `State ID: ${citizen.stateId}`,
          link: `/dashboard/civil-records?citizen=${citizen.id}`,
          icon: User,
          color: "cyan",
        });
      });

      // Add vehicles
      vehicles.slice(0, 3).forEach((vehicle: any) => {
        searchResults.push({
          id: vehicle.id,
          type: "vehicle",
          title: `${vehicle.make} ${vehicle.model}`,
          subtitle: `Plate: ${vehicle.plate}`,
          link: `/dashboard/civil-records?vehicle=${vehicle.id}`,
          icon: Car,
          color: "blue",
        });
      });

      // Add calls
      calls.slice(0, 3).forEach((call: any) => {
        searchResults.push({
          id: call.id,
          type: "call",
          title: `Call ${call.callNumber}`,
          subtitle: call.location || "No location",
          link: `/dashboard/dispatch?call=${call.id}`,
          icon: Radio,
          color: "yellow",
        });
      });

      // Add officers
      officers.slice(0, 3).forEach((officer: any) => {
        searchResults.push({
          id: officer.id,
          type: "officer",
          title: officer.name,
          subtitle: `Badge: ${officer.badge}`,
          link: `/dashboard/officers?id=${officer.id}`,
          icon: Users,
          color: "purple",
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleResultClick(result: SearchResult) {
    router.push(result.link);
    onClose();
    setQuery("");
  }

  function handleClose() {
    onClose();
    setQuery("");
    setResults([]);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      placement="top"
      classNames={{
        base: "mt-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="pb-2">
          <div className="flex items-center gap-2 w-full">
            <Search className="w-5 h-5 text-gray-400" />
            <span>Global Search</span>
            <div className="flex-1"></div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="pb-6">
          <Input
            autoFocus
            placeholder="Search citizens, vehicles, calls, officers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            classNames={{
              input: "text-lg",
            }}
          />

          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {loading && (
              <div className="text-center py-8 text-gray-400">Searching...</div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No results found for "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <Card
                      key={`${result.type}-${result.id}`}
                      isPressable
                      onPress={() => handleResultClick(result)}
                      className="bg-gray-900/50 border border-gray-800 hover:border-indigo-700 transition-colors"
                    >
                      <CardBody className="flex flex-row items-center gap-3 py-3">
                        <div className={`p-2 rounded-lg bg-${result.color}-500/20`}>
                          <Icon className={`w-5 h-5 text-${result.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{result.title}</p>
                          <p className="text-sm text-gray-400">{result.subtitle}</p>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={result.color as any}
                          className="capitalize"
                        >
                          {result.type}
                        </Chip>
                      </CardBody>
                    </Card>
                  );
                })}
              </>
            )}

            {query.length < 2 && (
              <div className="text-center py-8 text-gray-400">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
