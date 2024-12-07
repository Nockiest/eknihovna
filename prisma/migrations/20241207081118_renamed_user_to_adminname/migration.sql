/*
  Warnings:

  - You are about to drop the column `user` on the `backups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "backups" DROP COLUMN "user",
ADD COLUMN     "adminname" VARCHAR(255);
