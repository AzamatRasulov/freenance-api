/*
  Warnings:

  - You are about to drop the `invoice-items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invoice-items" DROP CONSTRAINT "invoice-items_invoiceTermsId_fkey";

-- AlterTable
ALTER TABLE "invoice-terms" ADD COLUMN     "items" JSONB[];

-- DropTable
DROP TABLE "invoice-items";
