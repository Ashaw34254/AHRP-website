-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "height" TEXT,
    "weight" TEXT,
    "eyeColor" TEXT,
    "hairColor" TEXT,
    "build" TEXT,
    "distinguishingFeatures" TEXT,
    "image" TEXT,
    "backstory" TEXT,
    "stateId" TEXT,
    "bloodType" TEXT,
    "licenseStatus" TEXT NOT NULL DEFAULT 'NONE',
    "firearmPermit" BOOLEAN NOT NULL DEFAULT false,
    "organDonor" BOOLEAN NOT NULL DEFAULT false,
    "veteranStatus" BOOLEAN NOT NULL DEFAULT false,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "occupation" TEXT,
    "department" TEXT,
    "rank" TEXT,
    "phoneNumber" TEXT,
    "placeOfBirth" TEXT,
    "nationality" TEXT,
    "education" TEXT,
    "personalityTraits" TEXT,
    "skills" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "playTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("backstory", "bloodType", "build", "createdAt", "dateOfBirth", "department", "distinguishingFeatures", "education", "eyeColor", "firstName", "gender", "hairColor", "height", "id", "image", "isActive", "isApproved", "lastName", "licenseStatus", "nationality", "occupation", "personalityTraits", "phoneNumber", "placeOfBirth", "playTime", "rank", "skills", "stateId", "updatedAt", "userId", "weight") SELECT "backstory", "bloodType", "build", "createdAt", "dateOfBirth", "department", "distinguishingFeatures", "education", "eyeColor", "firstName", "gender", "hairColor", "height", "id", "image", "isActive", "isApproved", "lastName", "licenseStatus", "nationality", "occupation", "personalityTraits", "phoneNumber", "placeOfBirth", "playTime", "rank", "skills", "stateId", "updatedAt", "userId", "weight" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE INDEX "Character_userId_idx" ON "Character"("userId");
CREATE INDEX "Character_firstName_lastName_idx" ON "Character"("firstName", "lastName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
