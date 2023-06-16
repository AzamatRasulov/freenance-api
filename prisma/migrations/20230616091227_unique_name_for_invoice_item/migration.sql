/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `invoice-items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoice-items_name_key" ON "invoice-items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_code_key" ON "invoices"("code");
