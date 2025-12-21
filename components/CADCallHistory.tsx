"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
} from "@nextui-org/react";
import { CADCallDetails } from "@/components/CADCallDetails";

interface Call {
  id: string;
  callNumber: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  description: string;
  callerName: string | null;
  callerPhone: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  units: Array<{
    id: string;
    callsign: string;
    department: string;
  }>;
}

export function CADCallHistory() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    priority: "",
    dateRange: "7", // Days
  });

  useEffect(() => {
    fetchCallHistory();
  }, [filters]);

  const fetchCallHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.type) params.set("type", filters.type);
      if (filters.priority) params.set("priority", filters.priority);
      params.set("days", filters.dateRange);
      params.set("status", "CLOSED,CANCELLED");

      const response = await fetch(`/api/cad/calls?${params.toString()}`);
      const data = await response.json();

      if (data.calls) {
        setCalls(data.calls);
      }
    } catch (error) {
      console.error("Failed to fetch call history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "primary";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CLOSED":
        return "default";
      case "CANCELLED":
        return "danger";
      default:
        return "primary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CALL_TYPES = [
    "TRAFFIC_STOP",
    "WELFARE_CHECK",
    "ROBBERY",
    "ASSAULT",
    "SHOTS_FIRED",
    "MEDICAL",
    "FIRE",
    "VEHICLE_ACCIDENT",
    "SUSPICIOUS_ACTIVITY",
    "OTHER",
  ];

  return (
    <>
      <Card className="border border-gray-800">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-bold">Call History</h3>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onClick={() => fetchCallHistory()}
            >
              Refresh
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Search by call number or location..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              size="sm"
              className="max-w-xs"
            />
            <Select
              placeholder="Call Type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              size="sm"
              className="max-w-[180px]"
            >
              {[{ key: "", label: "All Types" }, ...CALL_TYPES.map(type => ({ key: type, label: type.replace(/_/g, " ") }))].
                map(item => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
            </Select>
            <Select
              placeholder="Priority"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              size="sm"
              className="max-w-[150px]"
            >
              {[
                { key: "", label: "All Priorities" },
                { key: "EMERGENCY", label: "Emergency" },
                { key: "HIGH", label: "High" },
                { key: "MEDIUM", label: "Medium" },
                { key: "LOW", label: "Low" },
              ].map(item => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Time Range"
              selectedKeys={[filters.dateRange]}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              size="sm"
              className="max-w-[150px]"
            >
              {[
                { key: "1", label: "Last 24 Hours" },
                { key: "7", label: "Last 7 Days" },
                { key: "30", label: "Last 30 Days" },
                { key: "90", label: "Last 90 Days" },
              ].map(item => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No call history found
            </div>
          ) : (
            <Table
              aria-label="Call history table"
              classNames={{
                wrapper: "border border-gray-800",
              }}
            >
              <TableHeader>
                <TableColumn>CALL #</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>PRIORITY</TableColumn>
                <TableColumn>LOCATION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>UNITS</TableColumn>
                <TableColumn>CREATED</TableColumn>
                <TableColumn>CLOSED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-mono font-bold">
                      {call.callNumber}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {call.type.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getPriorityColor(call.priority) as any}
                        variant="flat"
                      >
                        {call.priority}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{call.location}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(call.status) as any}
                        variant="flat"
                      >
                        {call.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {call.units.length > 0 ? (
                          call.units.map((unit) => (
                            <Chip key={unit.id} size="sm" variant="bordered">
                              {unit.callsign}
                            </Chip>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No units
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{formatDate(call.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {call.closedAt ? formatDate(call.closedAt) : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => setSelectedCallId(call.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {selectedCallId && (
        <CADCallDetails
          callId={selectedCallId}
          isOpen={!!selectedCallId}
          onClose={() => setSelectedCallId(null)}
          onUpdate={() => fetchCallHistory()}
        />
      )}
    </>
  );
}
