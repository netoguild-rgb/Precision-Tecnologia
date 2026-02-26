-- AlterTable
ALTER TABLE "orders"
ADD COLUMN IF NOT EXISTS "paymentProvider" TEXT,
ADD COLUMN IF NOT EXISTS "providerPaymentId" TEXT,
ADD COLUMN IF NOT EXISTS "paymentReference" TEXT,
ADD COLUMN IF NOT EXISTS "paymentExpiresAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "paymentError" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "payment_attempts" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "externalId" TEXT,
    "idempotencyKey" TEXT,
    "amount" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'BRL',
    "payload" JSONB,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payment_attempts_orderId_fkey"
      FOREIGN KEY ("orderId")
      REFERENCES "orders"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_providerPaymentId_idx" ON "orders"("providerPaymentId");
CREATE INDEX IF NOT EXISTS "orders_paymentExpiresAt_idx" ON "orders"("paymentExpiresAt");
CREATE INDEX IF NOT EXISTS "payment_attempts_orderId_createdAt_idx" ON "payment_attempts"("orderId", "createdAt");
CREATE INDEX IF NOT EXISTS "payment_attempts_provider_externalId_idx" ON "payment_attempts"("provider", "externalId");
CREATE INDEX IF NOT EXISTS "payment_attempts_idempotencyKey_idx" ON "payment_attempts"("idempotencyKey");

