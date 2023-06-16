/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoices_userId_key" ON "invoices"("userId");
