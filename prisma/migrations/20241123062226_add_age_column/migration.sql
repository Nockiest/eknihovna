/*
  Warnings:

  - You are about to drop the column `createdAt` on the `knihy` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `knihy` table. All the data in the column will be lost.
  - Added the required column `updatedat` to the `knihy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "knihy" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL;
