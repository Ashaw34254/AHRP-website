-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "applicationType" TEXT NOT NULL,
    "formData" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "reviewNotes" TEXT,
    "feedback" TEXT,
    "submittedDate" DATETIME,
    "lastSavedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicationType", "createdAt", "feedback", "formData", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "submittedDate", "updatedAt", "userId") SELECT "applicationType", "createdAt", "feedback", "formData", "id", "reviewNotes", "reviewedAt", "reviewedBy", "status", "submittedDate", "updatedAt", "userId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_applicationType_idx" ON "Application"("applicationType");
CREATE INDEX "Application_isDraft_idx" ON "Application"("isDraft");
CREATE INDEX "Application_userId_isDraft_idx" ON "Application"("userId", "isDraft");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
