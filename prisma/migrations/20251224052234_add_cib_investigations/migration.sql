-- CreateTable
CREATE TABLE "Investigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "primaryInvestigator" TEXT NOT NULL,
    "secondaryInvestigators" TEXT,
    "summary" TEXT NOT NULL,
    "backgroundInfo" TEXT,
    "linkedPersons" TEXT,
    "linkedVehicles" TEXT,
    "linkedLocations" TEXT,
    "linkedIncidents" TEXT,
    "linkedReports" TEXT,
    "linkedCalls" TEXT,
    "courtCaseId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "handoverNotes" TEXT,
    "investigatorHistory" TEXT,
    "chargeRecommendations" TEXT,
    "prosecutionBrief" TEXT,
    "evidenceSummary" TEXT,
    "securityLevel" TEXT NOT NULL DEFAULT 'STANDARD',
    "assignedTeam" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InvestigationTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "performedBy" TEXT NOT NULL,
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvestigationTimeline_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "Investigation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvestigationEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "evidenceNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "thumbnailUrl" TEXT,
    "collectedAt" DATETIME NOT NULL,
    "collectedBy" TEXT NOT NULL,
    "location" TEXT,
    "custodyLog" TEXT,
    "isSeized" BOOLEAN NOT NULL DEFAULT false,
    "seizureAuthority" TEXT,
    "forensicNotes" TEXT,
    "analysedBy" TEXT,
    "analysedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isSuperseded" BOOLEAN NOT NULL DEFAULT false,
    "supersededBy" TEXT,
    "supersededReason" TEXT,
    "relevanceScore" INTEGER NOT NULL DEFAULT 5,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestigationEvidence_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "Investigation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvestigationNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'GENERAL',
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "mentionedOfficers" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestigationNote_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "Investigation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvestigationTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedTo" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "completedBy" TEXT,
    "result" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InvestigationTask_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "Investigation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Investigation_investigationId_key" ON "Investigation"("investigationId");

-- CreateIndex
CREATE INDEX "Investigation_investigationId_idx" ON "Investigation"("investigationId");

-- CreateIndex
CREATE INDEX "Investigation_status_idx" ON "Investigation"("status");

-- CreateIndex
CREATE INDEX "Investigation_classification_idx" ON "Investigation"("classification");

-- CreateIndex
CREATE INDEX "Investigation_primaryInvestigator_idx" ON "Investigation"("primaryInvestigator");

-- CreateIndex
CREATE INDEX "Investigation_assignedTeam_idx" ON "Investigation"("assignedTeam");

-- CreateIndex
CREATE INDEX "Investigation_securityLevel_idx" ON "Investigation"("securityLevel");

-- CreateIndex
CREATE INDEX "InvestigationTimeline_investigationId_idx" ON "InvestigationTimeline"("investigationId");

-- CreateIndex
CREATE INDEX "InvestigationTimeline_performedAt_idx" ON "InvestigationTimeline"("performedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationEvidence_evidenceNumber_key" ON "InvestigationEvidence"("evidenceNumber");

-- CreateIndex
CREATE INDEX "InvestigationEvidence_investigationId_idx" ON "InvestigationEvidence"("investigationId");

-- CreateIndex
CREATE INDEX "InvestigationEvidence_evidenceNumber_idx" ON "InvestigationEvidence"("evidenceNumber");

-- CreateIndex
CREATE INDEX "InvestigationEvidence_type_idx" ON "InvestigationEvidence"("type");

-- CreateIndex
CREATE INDEX "InvestigationEvidence_status_idx" ON "InvestigationEvidence"("status");

-- CreateIndex
CREATE INDEX "InvestigationNote_investigationId_idx" ON "InvestigationNote"("investigationId");

-- CreateIndex
CREATE INDEX "InvestigationNote_noteType_idx" ON "InvestigationNote"("noteType");

-- CreateIndex
CREATE INDEX "InvestigationNote_isImportant_idx" ON "InvestigationNote"("isImportant");

-- CreateIndex
CREATE INDEX "InvestigationTask_investigationId_idx" ON "InvestigationTask"("investigationId");

-- CreateIndex
CREATE INDEX "InvestigationTask_assignedTo_idx" ON "InvestigationTask"("assignedTo");

-- CreateIndex
CREATE INDEX "InvestigationTask_status_idx" ON "InvestigationTask"("status");

-- CreateIndex
CREATE INDEX "InvestigationTask_dueDate_idx" ON "InvestigationTask"("dueDate");
