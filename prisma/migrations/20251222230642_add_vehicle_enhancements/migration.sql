-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "year" INTEGER,
    "vin" TEXT,
    "make" TEXT,
    "isStolen" BOOLEAN NOT NULL DEFAULT false,
    "isWanted" BOOLEAN NOT NULL DEFAULT false,
    "isImpounded" BOOLEAN NOT NULL DEFAULT false,
    "registrationStatus" TEXT NOT NULL DEFAULT 'VALID',
    "insuranceStatus" TEXT NOT NULL DEFAULT 'VALID',
    "insuranceCompany" TEXT,
    "insurancePolicy" TEXT,
    "ownerId" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "notes" TEXT,
    "flags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Citizen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("color", "createdAt", "expiresAt", "id", "isStolen", "isWanted", "model", "ownerId", "plate", "registeredAt", "updatedAt", "year") SELECT "color", "createdAt", "expiresAt", "id", "isStolen", "isWanted", "model", "ownerId", "plate", "registeredAt", "updatedAt", "year" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
