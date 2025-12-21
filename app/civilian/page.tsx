"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FileText, Search, Shield, User, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";
import Link from "next/link";

interface ReportForm {
  reporterName: string;
  reporterContact: string;
  incidentType: string;
  location: string;
  description: string;
}

interface RecordRequest {
  requestorName: string;
  requestorEmail: string;
  requestType: string;
  subjectName: string;
  reason: string;
}

const INCIDENT_TYPES = [
  { value: "THEFT", label: "Theft" },
  { value: "VANDALISM", label: "Vandalism" },
  { value: "NOISE", label: "Noise Complaint" },
  { value: "SUSPICIOUS", label: "Suspicious Activity" },
  { value: "TRAFFIC", label: "Traffic Incident" },
  { value: "OTHER", label: "Other" },
];

const REQUEST_TYPES = [
  { value: "CRIMINAL", label: "Criminal Record" },
  { value: "DRIVING", label: "Driving Record" },
  { value: "PROPERTY", label: "Property Records" },
  { value: "INCIDENT", label: "Incident Report" },
];

export default function CivilianPortalPage() {
  const [reportForm, setReportForm] = useState<ReportForm>({
    reporterName: "",
    reporterContact: "",
    incidentType: "",
    location: "",
    description: "",
  });

  const [requestForm, setRequestForm] = useState<RecordRequest>({
    requestorName: "",
    requestorEmail: "",
    requestType: "",
    subjectName: "",
    reason: "",
  });

  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  async function handleReportSubmit() {
    try {
      if (!reportForm.reporterName || !reportForm.incidentType || !reportForm.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      const res = await fetch("/api/civilian/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportForm),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      toast.success("Report submitted successfully");
      setReportSubmitted(true);
      setReportForm({
        reporterName: "",
        reporterContact: "",
        incidentType: "",
        location: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  }

  async function handleRequestSubmit() {
    try {
      if (!requestForm.requestorName || !requestForm.requestorEmail || !requestForm.requestType) {
        toast.error("Please fill in all required fields");
        return;
      }

      const res = await fetch("/api/civilian/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });

      if (!res.ok) throw new Error("Failed to submit request");

      toast.success("Records request submitted successfully");
      setRequestSubmitted(true);
      setRequestForm({
        requestorName: "",
        requestorEmail: "",
        requestType: "",
        subjectName: "",
        reason: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                  Aurora Horizon RP
                </h1>
                <p className="text-sm text-gray-400">Civilian Services Portal</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="bordered" color="primary">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Civilian Services</h2>
          <p className="text-gray-400">
            Submit incident reports and request public records
          </p>
        </div>

        <Tabs
          aria-label="Civilian services"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "w-full",
            cursor: "bg-indigo-500",
            tab: "text-lg",
          }}
        >
          {/* Report Incident */}
          <Tab
            key="report"
            title={
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Report Incident</span>
              </div>
            }
          >
            <Card className="bg-gray-900/50 border border-gray-800 mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Submit Incident Report</h3>
                    <p className="text-sm text-gray-400">
                      Report non-emergency incidents to law enforcement
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {reportSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Report Submitted</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for your report. An officer will review it and may contact you
                      if additional information is needed.
                    </p>
                    <Button
                      color="primary"
                      onPress={() => setReportSubmitted(false)}
                    >
                      Submit Another Report
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="John Doe"
                        value={reportForm.reporterName}
                        onChange={(e) =>
                          setReportForm({ ...reportForm, reporterName: e.target.value })
                        }
                        isRequired
                      />
                      <Input
                        label="Contact Information"
                        placeholder="Phone or Email"
                        value={reportForm.reporterContact}
                        onChange={(e) =>
                          setReportForm({ ...reportForm, reporterContact: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Incident Type"
                        placeholder="Select type"
                        selectedKeys={reportForm.incidentType ? [reportForm.incidentType] : []}
                        onChange={(e) =>
                          setReportForm({ ...reportForm, incidentType: e.target.value })
                        }
                        isRequired
                      >
                        {INCIDENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Location"
                        placeholder="Street address or intersection"
                        value={reportForm.location}
                        onChange={(e) =>
                          setReportForm({ ...reportForm, location: e.target.value })
                        }
                      />
                    </div>

                    <Textarea
                      label="Description"
                      placeholder="Describe the incident in detail..."
                      value={reportForm.description}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, description: e.target.value })
                      }
                      minRows={6}
                      isRequired
                    />

                    <Button color="primary" size="lg" onPress={handleReportSubmit}>
                      Submit Report
                    </Button>
                  </>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Request Records */}
          <Tab
            key="records"
            title={
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Request Records</span>
              </div>
            }
          >
            <Card className="bg-gray-900/50 border border-gray-800 mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Request Public Records</h3>
                    <p className="text-sm text-gray-400">
                      Request copies of criminal, driving, or property records
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {requestSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Request Submitted</h3>
                    <p className="text-gray-400 mb-6">
                      Your records request has been received. Processing typically takes 3-5
                      business days. You will be contacted at the email address provided.
                    </p>
                    <Button
                      color="primary"
                      onPress={() => setRequestSubmitted(false)}
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="John Doe"
                        value={requestForm.requestorName}
                        onChange={(e) =>
                          setRequestForm({ ...requestForm, requestorName: e.target.value })
                        }
                        isRequired
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={requestForm.requestorEmail}
                        onChange={(e) =>
                          setRequestForm({ ...requestForm, requestorEmail: e.target.value })
                        }
                        isRequired
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Record Type"
                        placeholder="Select type"
                        selectedKeys={requestForm.requestType ? [requestForm.requestType] : []}
                        onChange={(e) =>
                          setRequestForm({ ...requestForm, requestType: e.target.value })
                        }
                        isRequired
                      >
                        {REQUEST_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Subject Name"
                        placeholder="Name on records (if different)"
                        value={requestForm.subjectName}
                        onChange={(e) =>
                          setRequestForm({ ...requestForm, subjectName: e.target.value })
                        }
                      />
                    </div>

                    <Textarea
                      label="Purpose of Request"
                      placeholder="Explain why you need these records..."
                      value={requestForm.reason}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, reason: e.target.value })
                      }
                      minRows={4}
                    />

                    <Button color="primary" size="lg" onPress={handleRequestSubmit}>
                      Submit Request
                    </Button>
                  </>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Status Check */}
          <Tab
            key="status"
            title={
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Check Status</span>
              </div>
            }
          >
            <Card className="bg-gray-900/50 border border-gray-800 mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Check Request Status</h3>
                    <p className="text-sm text-gray-400">
                      Track your report or records request
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="py-12 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Status tracking is currently under development. Please contact the department
                  directly for updates on your request.
                </p>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}
