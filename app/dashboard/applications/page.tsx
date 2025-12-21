"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Card, 
  CardBody,
  Chip,
  Button,
  Progress
} from "@nextui-org/react";
import { FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface Application {
  id: string;
  type: string;
  characterName: string;
  department: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    type: "Character Whitelist",
    characterName: "John Doe",
    department: "Police",
    status: "approved",
    submittedAt: "2024-01-15",
    reviewedAt: "2024-01-16",
    feedback: "Great backstory! Approved for police department.",
  },
  {
    id: "2",
    type: "Character Whitelist",
    characterName: "Jane Smith",
    department: "EMS",
    status: "approved",
    submittedAt: "2024-02-20",
    reviewedAt: "2024-02-21",
  },
  {
    id: "3",
    type: "Department Transfer",
    characterName: "Mike Johnson",
    department: "Fire",
    status: "under_review",
    submittedAt: "2024-03-10",
  },
];

const statusConfig = {
  pending: {
    color: "warning" as const,
    icon: Clock,
    label: "Pending",
  },
  under_review: {
    color: "primary" as const,
    icon: Eye,
    label: "Under Review",
  },
  approved: {
    color: "success" as const,
    icon: CheckCircle,
    label: "Approved",
  },
  rejected: {
    color: "danger" as const,
    icon: XCircle,
    label: "Rejected",
  },
};

export default function ApplicationsPage() {
  const pendingCount = mockApplications.filter(a => a.status === "pending" || a.status === "under_review").length;
  const approvedCount = mockApplications.filter(a => a.status === "approved").length;
  const totalCount = mockApplications.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-gray-400">Track your application status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">{totalCount}</div>
              <p className="text-gray-400">Total Applications</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{pendingCount}</div>
              <p className="text-gray-400">Pending Review</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">{approvedCount}</div>
              <p className="text-gray-400">Approved</p>
            </CardBody>
          </Card>
        </div>

        {/* Application Progress */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Approval Rate</h3>
              <span className="text-sm text-gray-400">{Math.round((approvedCount / totalCount) * 100)}%</span>
            </div>
            <Progress 
              value={(approvedCount / totalCount) * 100}
              color="success"
              className="mb-2"
            />
            <p className="text-sm text-gray-400">
              {approvedCount} of {totalCount} applications approved
            </p>
          </CardBody>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">All Applications</h2>
          
          {mockApplications.map((application) => {
            const status = statusConfig[application.status];
            const StatusIcon = status.icon;

            return (
              <Card key={application.id} className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500 transition-colors">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-indigo-600/20 rounded-lg">
                        <FileText className="w-6 h-6 text-indigo-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {application.type}
                          </h3>
                          <Chip
                            color={status.color}
                            variant="flat"
                            size="sm"
                            startContent={<StatusIcon className="w-3 h-3" />}
                          >
                            {status.label}
                          </Chip>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-400">
                          <p><strong className="text-gray-300">Character:</strong> {application.characterName}</p>
                          <p><strong className="text-gray-300">Department:</strong> {application.department}</p>
                          <p><strong className="text-gray-300">Submitted:</strong> <span suppressHydrationWarning>{new Date(application.submittedAt).toLocaleDateString()}</span></p>
                          {application.reviewedAt && (
                            <p><strong className="text-gray-300">Reviewed:</strong> <span suppressHydrationWarning>{new Date(application.reviewedAt).toLocaleDateString()}</span></p>
                          )}
                        </div>

                        {application.feedback && (
                          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-300 mb-1">Staff Feedback:</p>
                            <p className="text-sm text-gray-400">{application.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="bordered"
                      size="sm"
                      startContent={<Eye className="w-4 h-4" />}
                    >
                      View Details
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
