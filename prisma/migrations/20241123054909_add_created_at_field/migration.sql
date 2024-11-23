/*
  Warnings:

  - You are about to drop the column `book_code` on the `knihy` table. All the data in the column will be lost.
  - You are about to drop the column `umisteni` on the `knihy` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `knihy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "knihy_book_code_key";

-- AlterTable
ALTER TABLE "knihy" DROP COLUMN "book_code",
DROP COLUMN "umisteni",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isbn" VARCHAR(13),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
