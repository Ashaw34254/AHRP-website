-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DepartmentSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "department" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "maxUnits" INTEGER NOT NULL DEFAULT 20,
    "requireCertification" BOOLEAN NOT NULL DEFAULT true,
    "autoApprove" BOOLEAN NOT NULL DEFAULT false,
    "allowRecruitment" BOOLEAN NOT NULL DEFAULT true,
    "minPlaytime" INTEGER NOT NULL DEFAULT 10,
    "discordRole" TEXT,
    "description" TEXT,
    "homepageContent" TEXT,
    "motto" TEXT,
    "theme" TEXT NOT NULL,
    "ranks" TEXT NOT NULL DEFAULT '[]',
    "members" TEXT NOT NULL DEFAULT '[]',
    "announcements" TEXT NOT NULL DEFAULT '[]',
    "events" TEXT NOT NULL DEFAULT '[]',
    "news" TEXT NOT NULL DEFAULT '[]',
    "quickStats" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DepartmentSettings" ("allowRecruitment", "autoApprove", "createdAt", "department", "description", "discordRole", "enabled", "homepageContent", "id", "maxUnits", "members", "minPlaytime", "motto", "ranks", "requireCertification", "theme", "updatedAt") SELECT "allowRecruitment", "autoApprove", "createdAt", "department", "description", "discordRole", "enabled", "homepageContent", "id", "maxUnits", "members", "minPlaytime", "motto", "ranks", "requireCertification", "theme", "updatedAt" FROM "DepartmentSettings";
DROP TABLE "DepartmentSettings";
ALTER TABLE "new_DepartmentSettings" RENAME TO "DepartmentSettings";
CREATE UNIQUE INDEX "DepartmentSettings_department_key" ON "DepartmentSettings"("department");
CREATE INDEX "DepartmentSettings_department_idx" ON "DepartmentSettings"("department");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
