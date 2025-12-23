-- CreateTable
CREATE TABLE "DepartmentSettings" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentSettings_department_key" ON "DepartmentSettings"("department");

-- CreateIndex
CREATE INDEX "DepartmentSettings_department_idx" ON "DepartmentSettings"("department");
