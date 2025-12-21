-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "department" TEXT,
    "coordinates" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PointOfInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OfficerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "badgeNumber" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "division" TEXT,
    "hireDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "certifications" TEXT,
    "specializations" TEXT,
    "totalCalls" INTEGER NOT NULL DEFAULT 0,
    "totalArrests" INTEGER NOT NULL DEFAULT 0,
    "totalCitations" INTEGER NOT NULL DEFAULT 0,
    "hoursLogged" REAL NOT NULL DEFAULT 0,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officerId" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "certificationName" TEXT NOT NULL,
    "completedDate" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "instructor" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingRecord_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "OfficerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShiftLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "officerId" TEXT NOT NULL,
    "clockIn" DATETIME NOT NULL,
    "clockOut" DATETIME,
    "hoursWorked" REAL NOT NULL DEFAULT 0,
    "callsHandled" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShiftLog_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "OfficerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FleetVehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "callsign" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "plate" TEXT NOT NULL,
    "vin" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "lastMaintenance" DATETIME,
    "nextMaintenance" DATETIME,
    "assignedUnitId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL DEFAULT 0,
    "performedBy" TEXT NOT NULL,
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MaintenanceLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerId" TEXT,
    "propertyType" TEXT NOT NULL,
    "value" REAL,
    "latitude" REAL,
    "longitude" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessLicense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerId" TEXT,
    "licenseNumber" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "issuedDate" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FirearmRegistry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerName" TEXT NOT NULL,
    "ownerId" TEXT,
    "serialNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "caliber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isStolen" BOOLEAN NOT NULL DEFAULT false,
    "registrationDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportNumber" TEXT NOT NULL,
    "callId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "suspects" TEXT,
    "victims" TEXT,
    "witnesses" TEXT,
    "evidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CourtCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "defendantName" TEXT NOT NULL,
    "defendantId" TEXT,
    "charges" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "filedDate" DATETIME NOT NULL,
    "courtDate" DATETIME,
    "prosecutor" TEXT,
    "judge" TEXT,
    "verdict" TEXT,
    "sentence" TEXT,
    "fineAmount" REAL NOT NULL DEFAULT 0,
    "jailTime" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "patientId" TEXT,
    "stateId" TEXT,
    "dateOfBirth" TEXT NOT NULL,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "conditions" TEXT,
    "emergencyContact" TEXT,
    "insuranceInfo" TEXT,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MedicalIncident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalRecordId" TEXT NOT NULL,
    "callId" TEXT,
    "incidentDate" DATETIME NOT NULL,
    "chiefComplaint" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "medications" TEXT,
    "vitalSigns" TEXT,
    "transportedTo" TEXT,
    "disposition" TEXT NOT NULL,
    "treatedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalIncident_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FirePrePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buildingName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "buildingType" TEXT NOT NULL,
    "floors" INTEGER NOT NULL,
    "occupancy" INTEGER,
    "hydrantLocations" TEXT,
    "accessPoints" TEXT,
    "hazards" TEXT,
    "blueprintUrl" TEXT,
    "notes" TEXT,
    "lastInspection" DATETIME,
    "nextInspection" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HazmatEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chemicalName" TEXT NOT NULL,
    "unNumber" TEXT,
    "class" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hazards" TEXT NOT NULL,
    "emergencyProcedures" TEXT NOT NULL,
    "ppe" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "K9Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogName" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "handlerName" TEXT NOT NULL,
    "handlerId" TEXT,
    "specialization" TEXT NOT NULL,
    "certifiedDate" DATETIME NOT NULL,
    "recertDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "K9Deployment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "k9UnitId" TEXT NOT NULL,
    "callId" TEXT,
    "deployedAt" DATETIME NOT NULL,
    "purpose" TEXT NOT NULL,
    "result" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "K9Deployment_k9UnitId_fkey" FOREIGN KEY ("k9UnitId") REFERENCES "K9Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TacticalCallout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "calloutNumber" TEXT NOT NULL,
    "callId" TEXT,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedBy" TEXT NOT NULL,
    "commander" TEXT,
    "unitsDeployed" TEXT,
    "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrivedAt" DATETIME,
    "resolvedAt" DATETIME,
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MDTMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUnitId" TEXT NOT NULL,
    "fromCallsign" TEXT NOT NULL,
    "toUnitId" TEXT,
    "toCallsign" TEXT,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SupervisorAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "unitCallsign" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "acknowledgedBy" TEXT,
    "acknowledgedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
);

-- CreateTable
CREATE TABLE "CivilianReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reporterName" TEXT NOT NULL,
    "reporterEmail" TEXT,
    "reporterPhone" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "response" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecordsRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestNumber" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT,
    "requestType" TEXT NOT NULL,
    "recordDetails" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CallTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "descriptionTemplate" TEXT NOT NULL,
    "department" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "QuickAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "department" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FiveMServer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "apiKey" TEXT,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FiveMEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "playerId" TEXT,
    "playerName" TEXT,
    "location" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "data" TEXT NOT NULL,
    "autoCallCreated" BOOLEAN NOT NULL DEFAULT false,
    "callId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Zone_name_key" ON "Zone"("name");

-- CreateIndex
CREATE INDEX "PointOfInterest_type_idx" ON "PointOfInterest"("type");

-- CreateIndex
CREATE UNIQUE INDEX "OfficerProfile_officerId_key" ON "OfficerProfile"("officerId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficerProfile_badgeNumber_key" ON "OfficerProfile"("badgeNumber");

-- CreateIndex
CREATE INDEX "TrainingRecord_officerId_idx" ON "TrainingRecord"("officerId");

-- CreateIndex
CREATE INDEX "ShiftLog_officerId_clockIn_idx" ON "ShiftLog"("officerId", "clockIn");

-- CreateIndex
CREATE UNIQUE INDEX "FleetVehicle_callsign_key" ON "FleetVehicle"("callsign");

-- CreateIndex
CREATE UNIQUE INDEX "FleetVehicle_plate_key" ON "FleetVehicle"("plate");

-- CreateIndex
CREATE INDEX "FleetVehicle_department_status_idx" ON "FleetVehicle"("department", "status");

-- CreateIndex
CREATE INDEX "MaintenanceLog_vehicleId_idx" ON "MaintenanceLog"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_address_key" ON "Property"("address");

-- CreateIndex
CREATE INDEX "Property_ownerName_idx" ON "Property"("ownerName");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessLicense_licenseNumber_key" ON "BusinessLicense"("licenseNumber");

-- CreateIndex
CREATE INDEX "BusinessLicense_businessName_idx" ON "BusinessLicense"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "FirearmRegistry_serialNumber_key" ON "FirearmRegistry"("serialNumber");

-- CreateIndex
CREATE INDEX "FirearmRegistry_ownerName_idx" ON "FirearmRegistry"("ownerName");

-- CreateIndex
CREATE INDEX "FirearmRegistry_serialNumber_idx" ON "FirearmRegistry"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentReport_reportNumber_key" ON "IncidentReport"("reportNumber");

-- CreateIndex
CREATE INDEX "IncidentReport_reportNumber_idx" ON "IncidentReport"("reportNumber");

-- CreateIndex
CREATE INDEX "IncidentReport_status_idx" ON "IncidentReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CourtCase_caseNumber_key" ON "CourtCase"("caseNumber");

-- CreateIndex
CREATE INDEX "CourtCase_defendantName_idx" ON "CourtCase"("defendantName");

-- CreateIndex
CREATE INDEX "CourtCase_status_idx" ON "CourtCase"("status");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientName_idx" ON "MedicalRecord"("patientName");

-- CreateIndex
CREATE INDEX "MedicalRecord_stateId_idx" ON "MedicalRecord"("stateId");

-- CreateIndex
CREATE INDEX "MedicalIncident_medicalRecordId_idx" ON "MedicalIncident"("medicalRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "FirePrePlan_address_key" ON "FirePrePlan"("address");

-- CreateIndex
CREATE INDEX "FirePrePlan_address_idx" ON "FirePrePlan"("address");

-- CreateIndex
CREATE INDEX "HazmatEntry_chemicalName_idx" ON "HazmatEntry"("chemicalName");

-- CreateIndex
CREATE INDEX "HazmatEntry_unNumber_idx" ON "HazmatEntry"("unNumber");

-- CreateIndex
CREATE INDEX "K9Deployment_k9UnitId_idx" ON "K9Deployment"("k9UnitId");

-- CreateIndex
CREATE UNIQUE INDEX "TacticalCallout_calloutNumber_key" ON "TacticalCallout"("calloutNumber");

-- CreateIndex
CREATE INDEX "TacticalCallout_status_idx" ON "TacticalCallout"("status");

-- CreateIndex
CREATE INDEX "MDTMessage_toUnitId_isRead_idx" ON "MDTMessage"("toUnitId", "isRead");

-- CreateIndex
CREATE INDEX "SupervisorAlert_status_type_idx" ON "SupervisorAlert"("status", "type");

-- CreateIndex
CREATE UNIQUE INDEX "CivilianReport_reportNumber_key" ON "CivilianReport"("reportNumber");

-- CreateIndex
CREATE INDEX "CivilianReport_status_idx" ON "CivilianReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RecordsRequest_requestNumber_key" ON "RecordsRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "RecordsRequest_status_idx" ON "RecordsRequest"("status");

-- CreateIndex
CREATE INDEX "FiveMEvent_eventType_createdAt_idx" ON "FiveMEvent"("eventType", "createdAt");
