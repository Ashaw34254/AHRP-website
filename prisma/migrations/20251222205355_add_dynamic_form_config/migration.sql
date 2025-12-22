/*
  Warnings:

  - You are about to drop the column `ageGroup` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `characterBackstory` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `characterName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `discordUsername` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `whyJoin` on the `Application` table. All the data in the column will be lost.
  - Added the required column `formData` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ApplicationFormConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApplicationFormField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formConfigId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "pattern" TEXT,
    "options" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "width" TEXT NOT NULL DEFAULT 'full',
    "section" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApplicationFormField_formConfigId_fkey" FOREIGN KEY ("formConfigId") REFERENCES "ApplicationFormConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "applicationType" TEXT NOT NULL,
    "formData" TEXT NOT NULL,
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
INSERT INTO "new_Application" ("applicationType", "createdAt", "feedback", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "submittedDate", "updatedAt", "userId") SELECT "applicationType", "createdAt", "feedback", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "submittedDate", "updatedAt", "userId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_applicationType_idx" ON "Application"("applicationType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationFormConfig_name_key" ON "ApplicationFormConfig"("name");

-- CreateIndex
CREATE INDEX "ApplicationFormField_formConfigId_idx" ON "ApplicationFormField"("formConfigId");

-- CreateIndex
CREATE INDEX "ApplicationFormField_order_idx" ON "ApplicationFormField"("order");
