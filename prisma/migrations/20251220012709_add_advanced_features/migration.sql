-- CreateTable
CREATE TABLE "PanicAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "unitCallsign" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
);

-- CreateTable
CREATE TABLE "BOLO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "personName" TEXT,
    "personDesc" TEXT,
    "vehiclePlate" TEXT,
    "vehicleModel" TEXT,
    "vehicleColor" TEXT,
    "imageUrl" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "issuedBy" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BackupRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestingUnitId" TEXT NOT NULL,
    "requestingUnit" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "callId" TEXT,
    "callNumber" TEXT,
    "location" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "urgency" TEXT NOT NULL DEFAULT 'ROUTINE',
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StatusCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "department" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StatusLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "unitCallsign" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "callId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DispatcherSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME
);

-- CreateTable
CREATE TABLE "DispatcherMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "toUserId" TEXT,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PanicAlert_status_createdAt_idx" ON "PanicAlert"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BOLO_status_priority_idx" ON "BOLO"("status", "priority");

-- CreateIndex
CREATE INDEX "BackupRequest_status_urgency_idx" ON "BackupRequest"("status", "urgency");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StatusCode_code_key" ON "StatusCode"("code");

-- CreateIndex
CREATE INDEX "StatusLog_unitId_createdAt_idx" ON "StatusLog"("unitId", "createdAt");

-- CreateIndex
CREATE INDEX "DispatcherSession_status_idx" ON "DispatcherSession"("status");

-- CreateIndex
CREATE INDEX "DispatcherMessage_toUserId_isRead_idx" ON "DispatcherMessage"("toUserId", "isRead");
