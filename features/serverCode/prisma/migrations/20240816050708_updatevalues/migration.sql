/*
  Warnings:

  - A unique constraint covering the columns `[book_code]` on the table `knihy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `knihy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "knihy_book_code_key" ON "knihy"("book_code");

-- CreateIndex
CREATE UNIQUE INDEX "knihy_name_key" ON "knihy"("name");
