-- CreateTable
CREATE TABLE "CharacterNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "createdBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterNote_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "flagType" TEXT NOT NULL,
    "reason" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "createdBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'cad',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterFlag_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterWarrant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "offense" TEXT NOT NULL,
    "description" TEXT,
    "bail" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'cad',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterWarrant_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterCitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "violation" TEXT NOT NULL,
    "fine" INTEGER NOT NULL,
    "notes" TEXT,
    "location" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterCitation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterArrest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "charges" TEXT NOT NULL,
    "narrative" TEXT,
    "location" TEXT,
    "arrestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrestedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterArrest_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Arrest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citizenId" TEXT NOT NULL,
    "charges" TEXT NOT NULL,
    "notes" TEXT,
    "arrestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrestedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'cad',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Arrest_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Arrest" ("arrestedAt", "arrestedBy", "charges", "citizenId", "createdAt", "id", "notes") SELECT "arrestedAt", "arrestedBy", "charges", "citizenId", "createdAt", "id", "notes" FROM "Arrest";
DROP TABLE "Arrest";
ALTER TABLE "new_Arrest" RENAME TO "Arrest";
CREATE TABLE "new_Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citizenId" TEXT NOT NULL,
    "violation" TEXT NOT NULL,
    "fine" INTEGER NOT NULL,
    "notes" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'cad',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Citation_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Citation" ("citizenId", "createdAt", "fine", "id", "isPaid", "issuedAt", "issuedBy", "notes", "violation") SELECT "citizenId", "createdAt", "fine", "id", "isPaid", "issuedAt", "issuedBy", "notes", "violation" FROM "Citation";
DROP TABLE "Citation";
ALTER TABLE "new_Citation" RENAME TO "Citation";
CREATE TABLE "new_DispatcherMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "fromCallsign" TEXT,
    "toUserId" TEXT,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "channel" TEXT DEFAULT 'general',
    "category" TEXT,
    "mentions" TEXT,
    "parentId" TEXT,
    "threadId" TEXT,
    "expiresAt" DATETIME,
    "department" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DispatcherMessage" ("createdAt", "fromName", "fromUserId", "id", "isRead", "message", "priority", "toUserId") SELECT "createdAt", "fromName", "fromUserId", "id", "isRead", "message", "priority", "toUserId" FROM "DispatcherMessage";
DROP TABLE "DispatcherMessage";
ALTER TABLE "new_DispatcherMessage" RENAME TO "DispatcherMessage";
CREATE INDEX "DispatcherMessage_toUserId_isRead_idx" ON "DispatcherMessage"("toUserId", "isRead");
CREATE INDEX "DispatcherMessage_channel_idx" ON "DispatcherMessage"("channel");
CREATE INDEX "DispatcherMessage_category_idx" ON "DispatcherMessage"("category");
CREATE INDEX "DispatcherMessage_threadId_idx" ON "DispatcherMessage"("threadId");
CREATE TABLE "new_Warrant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citizenId" TEXT NOT NULL,
    "offense" TEXT NOT NULL,
    "description" TEXT,
    "bail" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'cad',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Warrant_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Warrant" ("bail", "citizenId", "createdAt", "description", "id", "isActive", "issuedAt", "issuedBy", "offense") SELECT "bail", "citizenId", "createdAt", "description", "id", "isActive", "issuedAt", "issuedBy", "offense" FROM "Warrant";
DROP TABLE "Warrant";
ALTER TABLE "new_Warrant" RENAME TO "Warrant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CharacterNote_characterId_idx" ON "CharacterNote"("characterId");

-- CreateIndex
CREATE INDEX "CharacterNote_source_idx" ON "CharacterNote"("source");

-- CreateIndex
CREATE INDEX "CharacterFlag_characterId_idx" ON "CharacterFlag"("characterId");

-- CreateIndex
CREATE INDEX "CharacterFlag_source_idx" ON "CharacterFlag"("source");

-- CreateIndex
CREATE INDEX "CharacterFlag_isActive_idx" ON "CharacterFlag"("isActive");

-- CreateIndex
CREATE INDEX "CharacterWarrant_characterId_idx" ON "CharacterWarrant"("characterId");

-- CreateIndex
CREATE INDEX "CharacterWarrant_source_idx" ON "CharacterWarrant"("source");

-- CreateIndex
CREATE INDEX "CharacterWarrant_isActive_idx" ON "CharacterWarrant"("isActive");

-- CreateIndex
CREATE INDEX "CharacterCitation_characterId_idx" ON "CharacterCitation"("characterId");

-- CreateIndex
CREATE INDEX "CharacterCitation_source_idx" ON "CharacterCitation"("source");

-- CreateIndex
CREATE INDEX "CharacterCitation_isPaid_idx" ON "CharacterCitation"("isPaid");

-- CreateIndex
CREATE INDEX "CharacterArrest_characterId_idx" ON "CharacterArrest"("characterId");

-- CreateIndex
CREATE INDEX "CharacterArrest_source_idx" ON "CharacterArrest"("source");
