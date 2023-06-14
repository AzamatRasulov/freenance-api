-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "user-addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user-addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user-addresses_userId_key" ON "user-addresses"("userId");

-- AddForeignKey
ALTER TABLE "user-addresses" ADD CONSTRAINT "user-addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
