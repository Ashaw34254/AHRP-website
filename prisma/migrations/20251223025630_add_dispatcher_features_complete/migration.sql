-- AlterTable
ALTER TABLE "DispatcherMessage" ADD COLUMN "attachmentType" TEXT;
ALTER TABLE "DispatcherMessage" ADD COLUMN "attachmentUrl" TEXT;
ALTER TABLE "DispatcherMessage" ADD COLUMN "callNumber" TEXT;
ALTER TABLE "DispatcherMessage" ADD COLUMN "editedAt" DATETIME;
ALTER TABLE "DispatcherMessage" ADD COLUMN "location" TEXT;
ALTER TABLE "DispatcherMessage" ADD COLUMN "reactions" TEXT;

-- CreateTable
CREATE TABLE "MessageBookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT,
    "department" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MessageReadReceipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "readAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "MessageBookmark_userId_idx" ON "MessageBookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageBookmark_userId_messageId_key" ON "MessageBookmark"("userId", "messageId");

-- CreateIndex
CREATE INDEX "MessageTemplate_userId_idx" ON "MessageTemplate"("userId");

-- CreateIndex
CREATE INDEX "MessageTemplate_department_idx" ON "MessageTemplate"("department");

-- CreateIndex
CREATE INDEX "MessageReadReceipt_messageId_idx" ON "MessageReadReceipt"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReadReceipt_messageId_userId_key" ON "MessageReadReceipt"("messageId", "userId");

-- CreateIndex
CREATE INDEX "DispatcherMessage_callNumber_idx" ON "DispatcherMessage"("callNumber");
