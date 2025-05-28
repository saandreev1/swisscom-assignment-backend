/*
  Warnings:

  - You are about to drop the column `applicantName` on the `FeedbackRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FeedbackRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "candidateName" TEXT,
    "reviewerId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedbackRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FeedbackRequest_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FeedbackRequest" ("candidateEmail", "createdAt", "formId", "id", "reviewerId", "status", "token") SELECT "candidateEmail", "createdAt", "formId", "id", "reviewerId", "status", "token" FROM "FeedbackRequest";
DROP TABLE "FeedbackRequest";
ALTER TABLE "new_FeedbackRequest" RENAME TO "FeedbackRequest";
CREATE UNIQUE INDEX "FeedbackRequest_token_key" ON "FeedbackRequest"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
