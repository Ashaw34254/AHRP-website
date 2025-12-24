-- CreateTable
CREATE TABLE "FieldInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "officerId" TEXT,
    "officerCallsign" TEXT NOT NULL,
    "unitId" TEXT,
    "persons" TEXT,
    "vehicles" TEXT,
    "outcome" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "escalatedToCIB" BOOLEAN NOT NULL DEFAULT false,
    "escalationNotes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER
);

-- CreateTable
CREATE TABLE "TrafficStop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stopNumber" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverName" TEXT,
    "driverLicense" TEXT,
    "location" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "officerId" TEXT,
    "officerCallsign" TEXT NOT NULL,
    "backupUnits" TEXT,
    "duration" INTEGER,
    "occupants" INTEGER NOT NULL DEFAULT 1,
    "citationIds" TEXT,
    "warningIssued" BOOLEAN NOT NULL DEFAULT false,
    "arrestMade" BOOLEAN NOT NULL DEFAULT false,
    "vehicleImpounded" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "conditions" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pursuit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pursuitNumber" TEXT NOT NULL,
    "vehiclePlate" TEXT,
    "vehicleDesc" TEXT,
    "suspectDesc" TEXT,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT,
    "route" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "riskLevel" TEXT NOT NULL,
    "peakSpeed" INTEGER,
    "duration" INTEGER NOT NULL,
    "distance" REAL,
    "primaryUnit" TEXT NOT NULL,
    "unitsInvolved" TEXT NOT NULL,
    "airSupportUsed" BOOLEAN NOT NULL DEFAULT false,
    "outcome" TEXT,
    "injuriesReported" BOOLEAN NOT NULL DEFAULT false,
    "damageReported" BOOLEAN NOT NULL DEFAULT false,
    "terminatedBy" TEXT,
    "terminationReason" TEXT,
    "notes" TEXT,
    "tactics" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Infringement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "infringementNumber" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverName" TEXT NOT NULL,
    "driverLicense" TEXT,
    "driverAddress" TEXT,
    "offence" TEXT NOT NULL,
    "offenceDescription" TEXT,
    "location" TEXT NOT NULL,
    "fineAmount" INTEGER NOT NULL,
    "demeritPoints" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" DATETIME,
    "paymentReference" TEXT,
    "courtDate" DATETIME,
    "courtAppearanceRequired" BOOLEAN NOT NULL DEFAULT false,
    "disputed" BOOLEAN NOT NULL DEFAULT false,
    "issuedBy" TEXT NOT NULL,
    "witnessOfficers" TEXT,
    "photoEvidence" TEXT,
    "radarReading" INTEGER,
    "videoEvidence" TEXT,
    "notes" TEXT,
    "conditions" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DefectNotice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noticeNumber" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleId" TEXT,
    "ownerName" TEXT NOT NULL,
    "defectType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rectificationRequired" BOOLEAN NOT NULL DEFAULT true,
    "rectifyByDate" DATETIME,
    "reinspectionRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "rectifiedAt" DATETIME,
    "verifiedBy" TEXT,
    "issuedBy" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "photoEvidence" TEXT,
    "notes" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FieldInteraction_officerCallsign_timestamp_idx" ON "FieldInteraction"("officerCallsign", "timestamp");

-- CreateIndex
CREATE INDEX "FieldInteraction_type_idx" ON "FieldInteraction"("type");

-- CreateIndex
CREATE INDEX "FieldInteraction_escalatedToCIB_idx" ON "FieldInteraction"("escalatedToCIB");

-- CreateIndex
CREATE UNIQUE INDEX "TrafficStop_stopNumber_key" ON "TrafficStop"("stopNumber");

-- CreateIndex
CREATE INDEX "TrafficStop_vehiclePlate_idx" ON "TrafficStop"("vehiclePlate");

-- CreateIndex
CREATE INDEX "TrafficStop_officerCallsign_timestamp_idx" ON "TrafficStop"("officerCallsign", "timestamp");

-- CreateIndex
CREATE INDEX "TrafficStop_outcome_idx" ON "TrafficStop"("outcome");

-- CreateIndex
CREATE INDEX "TrafficStop_reason_idx" ON "TrafficStop"("reason");

-- CreateIndex
CREATE UNIQUE INDEX "Pursuit_pursuitNumber_key" ON "Pursuit"("pursuitNumber");

-- CreateIndex
CREATE INDEX "Pursuit_status_idx" ON "Pursuit"("status");

-- CreateIndex
CREATE INDEX "Pursuit_vehiclePlate_idx" ON "Pursuit"("vehiclePlate");

-- CreateIndex
CREATE INDEX "Pursuit_startedAt_idx" ON "Pursuit"("startedAt");

-- CreateIndex
CREATE INDEX "Pursuit_primaryUnit_idx" ON "Pursuit"("primaryUnit");

-- CreateIndex
CREATE UNIQUE INDEX "Infringement_infringementNumber_key" ON "Infringement"("infringementNumber");

-- CreateIndex
CREATE INDEX "Infringement_vehiclePlate_idx" ON "Infringement"("vehiclePlate");

-- CreateIndex
CREATE INDEX "Infringement_driverName_idx" ON "Infringement"("driverName");

-- CreateIndex
CREATE INDEX "Infringement_isPaid_idx" ON "Infringement"("isPaid");

-- CreateIndex
CREATE INDEX "Infringement_issuedAt_idx" ON "Infringement"("issuedAt");

-- CreateIndex
CREATE INDEX "Infringement_offence_idx" ON "Infringement"("offence");

-- CreateIndex
CREATE UNIQUE INDEX "DefectNotice_noticeNumber_key" ON "DefectNotice"("noticeNumber");

-- CreateIndex
CREATE INDEX "DefectNotice_vehiclePlate_idx" ON "DefectNotice"("vehiclePlate");

-- CreateIndex
CREATE INDEX "DefectNotice_status_idx" ON "DefectNotice"("status");

-- CreateIndex
CREATE INDEX "DefectNotice_rectifyByDate_idx" ON "DefectNotice"("rectifyByDate");
