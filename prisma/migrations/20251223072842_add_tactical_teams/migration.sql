/*
  Warnings:

  - You are about to drop the column `activatedAt` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `arrivedAt` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `calloutNumber` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `commander` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `outcome` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TacticalCallout` table. All the data in the column will be lost.
  - You are about to drop the column `unitsDeployed` on the `TacticalCallout` table. All the data in the column will be lost.
  - Added the required column `incidentType` to the `TacticalCallout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team` to the `TacticalCallout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_TacticalCalloutOfficer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TacticalCalloutOfficer_A_fkey" FOREIGN KEY ("A") REFERENCES "Officer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TacticalCalloutOfficer_B_fkey" FOREIGN KEY ("B") REFERENCES "TacticalCallout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Officer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "callsign" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "badge" TEXT,
    "department" TEXT NOT NULL,
    "rank" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dutyStatus" TEXT NOT NULL DEFAULT 'OUT_OF_SERVICE',
    "isTactical" BOOLEAN NOT NULL DEFAULT false,
    "tacticalTeam" TEXT,
    "tacticalRole" TEXT,
    "qualifications" TEXT,
    "lastTraining" DATETIME,
    "responseTime" INTEGER,
    "equipment" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "unitId" TEXT,
    CONSTRAINT "Officer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Officer_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Officer" ("badge", "callsign", "createdAt", "department", "dutyStatus", "id", "isActive", "name", "rank", "unitId", "updatedAt", "userId") SELECT "badge", "callsign", "createdAt", "department", "dutyStatus", "id", "isActive", "name", "rank", "unitId", "updatedAt", "userId" FROM "Officer";
DROP TABLE "Officer";
ALTER TABLE "new_Officer" RENAME TO "Officer";
CREATE UNIQUE INDEX "Officer_callsign_key" ON "Officer"("callsign");
CREATE TABLE "new_TacticalCallout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "calloutTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'URGENT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "team" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "briefing" TEXT,
    "stagingArea" TEXT,
    "callId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TacticalCallout_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TacticalCallout" ("callId", "createdAt", "id", "location", "priority", "requestedBy", "status", "updatedAt") SELECT "callId", "createdAt", "id", "location", "priority", "requestedBy", "status", "updatedAt" FROM "TacticalCallout";
DROP TABLE "TacticalCallout";
ALTER TABLE "new_TacticalCallout" RENAME TO "TacticalCallout";
CREATE INDEX "TacticalCallout_status_idx" ON "TacticalCallout"("status");
CREATE INDEX "TacticalCallout_team_idx" ON "TacticalCallout"("team");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_TacticalCalloutOfficer_AB_unique" ON "_TacticalCalloutOfficer"("A", "B");

-- CreateIndex
CREATE INDEX "_TacticalCalloutOfficer_B_index" ON "_TacticalCalloutOfficer"("B");
