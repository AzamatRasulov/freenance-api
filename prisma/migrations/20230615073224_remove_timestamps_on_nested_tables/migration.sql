/*
  Warnings:

  - You are about to drop the column `createdAt` on the `client-addresses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `client-addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user-addresses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user-addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "client-addresses" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user-addresses" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");
