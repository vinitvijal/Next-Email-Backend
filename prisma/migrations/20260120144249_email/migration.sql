/*
  Warnings:

  - Added the required column `userId` to the `Emails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emails" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
