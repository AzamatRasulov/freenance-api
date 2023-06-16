-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-senders" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "invoice-senders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-sender-addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "invoiceSenderId" INTEGER NOT NULL,

    CONSTRAINT "invoice-sender-addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-receivers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "invoice-receivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-receiver-addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "invoiceReceiverId" INTEGER NOT NULL,

    CONSTRAINT "invoice-receiver-addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-terms" (
    "id" SERIAL NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "invoice-terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice-items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "invoiceTermsId" INTEGER NOT NULL,

    CONSTRAINT "invoice-items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice-senders_invoiceId_key" ON "invoice-senders"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice-sender-addresses_invoiceSenderId_key" ON "invoice-sender-addresses"("invoiceSenderId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice-receivers_invoiceId_key" ON "invoice-receivers"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice-receiver-addresses_invoiceReceiverId_key" ON "invoice-receiver-addresses"("invoiceReceiverId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice-terms_invoiceId_key" ON "invoice-terms"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice-items_invoiceTermsId_key" ON "invoice-items"("invoiceTermsId");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-senders" ADD CONSTRAINT "invoice-senders_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-sender-addresses" ADD CONSTRAINT "invoice-sender-addresses_invoiceSenderId_fkey" FOREIGN KEY ("invoiceSenderId") REFERENCES "invoice-senders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-receivers" ADD CONSTRAINT "invoice-receivers_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-receiver-addresses" ADD CONSTRAINT "invoice-receiver-addresses_invoiceReceiverId_fkey" FOREIGN KEY ("invoiceReceiverId") REFERENCES "invoice-receivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-terms" ADD CONSTRAINT "invoice-terms_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice-items" ADD CONSTRAINT "invoice-items_invoiceTermsId_fkey" FOREIGN KEY ("invoiceTermsId") REFERENCES "invoice-terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
