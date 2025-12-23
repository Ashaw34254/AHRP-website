/*
  Warnings:

  - You are about to drop the column `createdBy` on the `CallTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `CallTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CallTemplate` table. All the data in the column will be lost.
  - Added the required column `callType` to the `CallTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `CallTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `CallTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CallTemplate` table without a default value. This is not possible if the table is not empty.
  - Made the column `department` on table `CallTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Unit" ADD COLUMN "lastStatusChange" DATETIME;
ALTER TABLE "Unit" ADD COLUMN "responseTime" INTEGER;
ALTER TABLE "Unit" ADD COLUMN "statusCode" TEXT;
ALTER TABLE "Unit" ADD COLUMN "unitType" TEXT;
ALTER TABLE "Unit" ADD COLUMN "zone" TEXT;

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "assignedToUnitId" TEXT,
    "location" TEXT,
    "lastInspection" DATETIME,
    "nextInspection" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_assignedToUnitId_fkey" FOREIGN KEY ("assignedToUnitId") REFERENCES "Unit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Call" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "callNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "department" TEXT,
    "location" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "postal" TEXT,
    "zone" TEXT,
    "description" TEXT NOT NULL,
    "caller" TEXT,
    "callerPhone" TEXT,
    "fireSize" TEXT,
    "hazmat" BOOLEAN NOT NULL DEFAULT false,
    "alarmLevel" TEXT,
    "patientAge" INTEGER,
    "patientGender" TEXT,
    "consciousness" TEXT,
    "responseTimeTarget" INTEGER,
    "actualResponseTime" INTEGER,
    "requiresMutualAid" BOOLEAN NOT NULL DEFAULT false,
    "notifiedDepartments" TEXT,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "escalatedFrom" TEXT,
    "escalatedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatchedAt" DATETIME,
    "closedAt" DATETIME,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Call_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Call" ("callNumber", "caller", "callerPhone", "closedAt", "createdAt", "createdById", "description", "dispatchedAt", "id", "latitude", "location", "longitude", "postal", "priority", "status", "type") SELECT "callNumber", "caller", "callerPhone", "closedAt", "createdAt", "createdById", "description", "dispatchedAt", "id", "latitude", "location", "longitude", "postal", "priority", "status", "type" FROM "Call";
DROP TABLE "Call";
ALTER TABLE "new_Call" RENAME TO "Call";
CREATE UNIQUE INDEX "Call_callNumber_key" ON "Call"("callNumber");
CREATE INDEX "Call_status_priority_idx" ON "Call"("status", "priority");
CREATE INDEX "Call_createdAt_idx" ON "Call"("createdAt");
CREATE INDEX "Call_department_idx" ON "Call"("department");
CREATE INDEX "Call_zone_idx" ON "Call"("zone");
CREATE TABLE "new_CallTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "callType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "descriptionTemplate" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CallTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CallTemplate" ("createdAt", "department", "descriptionTemplate", "id", "name", "priority") SELECT "createdAt", "department", "descriptionTemplate", "id", "name", "priority" FROM "CallTemplate";
DROP TABLE "CallTemplate";
ALTER TABLE "new_CallTemplate" RENAME TO "CallTemplate";
CREATE INDEX "CallTemplate_department_idx" ON "CallTemplate"("department");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Equipment_department_idx" ON "Equipment"("department");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");
