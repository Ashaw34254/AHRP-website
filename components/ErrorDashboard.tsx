"use client";

import { useState, useEffect } from "react";
import { ErrorLogger, ErrorLog } from "@/lib/error-logger";
import { 
  AlertCircle, 
  Bug, 
  Database, 
  Network, 
  Shield, 
  Code, 
  Download,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Select, SelectItem } from "@nextui-org/select";

const severityColors = {
  low: "primary",
  medium: "warning",
  high: "danger",
  critical: "danger",
} as const;

const categoryIcons = {
  network: Network,
  database: Database,
  authentication: Shield,
  validation: AlertCircle,
  runtime: Code,
  rendering: Code,
  api: Bug,
  unknown: AlertCircle,
};

export default function ErrorDashboard() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState(ErrorLogger.getStatistics());
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    refreshErrors();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshErrors, 5000);
    return () => clearInterval(interval);
  }, [severityFilter, categoryFilter]);

  const refreshErrors = () => {
    const filters: any = {};
    if (severityFilter !== "all") filters.severity = severityFilter;
    if (categoryFilter !== "all") filters.category = categoryFilter;
    
    const logs = ErrorLogger.getErrorLogs(filters);
    setErrors(logs);
    setStats(ErrorLogger.getStatistics());
  };

  const clearAllErrors = () => {
    if (confirm("Are you sure you want to clear all error logs?")) {
      ErrorLogger.clearLogs();
      refreshErrors();
    }
  };

  const downloadLogs = () => {
    const data = ErrorLogger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyErrorDetails = (error: ErrorLog) => {
    const details = `
Error ID: ${error.id}
Timestamp: ${error.timestamp}
Severity: ${error.severity}
Category: ${error.category}
Message: ${error.message}
URL: ${error.url || 'N/A'}
${error.stack ? `\nStack Trace:\n${error.stack}` : ''}
${error.context ? `\nContext:\n${JSON.stringify(error.context, null, 2)}` : ''}
`;
    navigator.clipboard.writeText(details);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Errors</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">{stats.bySeverity.critical}</div>
            <div className="text-sm text-gray-400">Critical</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">{stats.bySeverity.high}</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.bySeverity.medium}</div>
            <div className="text-sm text-gray-400">Medium Priority</div>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Filters:</span>
              </div>
              
              <Select
                label="Severity"
                size="sm"
                className="w-40"
                selectedKeys={[severityFilter]}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <SelectItem key="all" value="all">All</SelectItem>
                <SelectItem key="critical" value="critical">Critical</SelectItem>
                <SelectItem key="high" value="high">High</SelectItem>
                <SelectItem key="medium" value="medium">Medium</SelectItem>
                <SelectItem key="low" value="low">Low</SelectItem>
              </Select>

              <Select
                label="Category"
                size="sm"
                className="w-40"
                selectedKeys={[categoryFilter]}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <SelectItem key="all" value="all">All</SelectItem>
                <SelectItem key="network" value="network">Network</SelectItem>
                <SelectItem key="database" value="database">Database</SelectItem>
                <SelectItem key="api" value="api">API</SelectItem>
                <SelectItem key="authentication" value="authentication">Auth</SelectItem>
                <SelectItem key="runtime" value="runtime">Runtime</SelectItem>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                color="primary"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={refreshErrors}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                color="default"
                startContent={<Download className="w-4 h-4" />}
                onPress={downloadLogs}
              >
                Export
              </Button>
              <Button
                size="sm"
                color="danger"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={clearAllErrors}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Error List */}
      <div className="space-y-3">
        {errors.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No errors logged</p>
            </CardBody>
          </Card>
        ) : (
          errors.map((error) => {
            const Icon = categoryIcons[error.category];
            const isExpanded = expandedError === error.id;

            return (
              <Card key={error.id}>
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <Icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Chip
                            size="sm"
                            color={severityColors[error.severity]}
                            variant="flat"
                          >
                            {error.severity.toUpperCase()}
                          </Chip>
                          <Chip size="sm" variant="bordered">
                            {error.category}
                          </Chip>
                          <span className="text-xs text-gray-500">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium break-words">
                          {error.message}
                        </p>
                        {error.url && (
                          <p className="text-xs text-gray-500 mt-1 break-all">
                            {error.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setExpandedError(isExpanded ? null : error.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardBody className="pt-4">
                    <div className="space-y-4">
                      {/* Error ID */}
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Error ID:</span>
                        <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono text-gray-300">
                          {error.id}
                        </code>
                      </div>

                      {/* Context */}
                      {error.context && (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Context:</span>
                          <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto">
                            {JSON.stringify(error.context, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Stack Trace */}
                      {error.stack && (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Stack Trace:</span>
                          <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-700">
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => copyErrorDetails(error)}
                        >
                          Copy Details
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
