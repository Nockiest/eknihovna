-- DropIndex
DROP INDEX "knihy_name_key";

-- AlterTable
ALTER TABLE "knihy" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "author" SET DATA TYPE VARCHAR(255);
