/*
  Warnings:

  - You are about to drop the column `department` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `interviewDate` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `interviewNotes` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `motivation` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `references` on the `Application` table. All the data in the column will be lost.
  - Added the required column `ageGroup` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationType` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characterBackstory` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordUsername` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whyJoin` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Made the column `availability` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "applicationType" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "characterBackstory" TEXT NOT NULL,
    "whyJoin" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "reviewNotes" TEXT,
    "feedback" TEXT,
    "submittedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("availability", "characterName", "createdAt", "experience", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "updatedAt", "userId") SELECT "availability", "characterName", "createdAt", "experience", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "updatedAt", "userId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_applicationType_idx" ON "Application"("applicationType");
CREATE INDEX "Application_discordUsername_idx" ON "Application"("discordUsername");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
