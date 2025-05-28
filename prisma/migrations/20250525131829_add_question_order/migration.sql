/*
  Warnings:

  - Added the required column `order` to the `FormQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FormQuestion" ("formId", "id", "questionId") SELECT "formId", "id", "questionId" FROM "FormQuestion";
DROP TABLE "FormQuestion";
ALTER TABLE "new_FormQuestion" RENAME TO "FormQuestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
