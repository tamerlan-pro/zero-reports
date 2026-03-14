-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "reportSlug" TEXT NOT NULL,
    "callbackUrl" TEXT NOT NULL,
    "events" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Webhook_reportSlug_idx" ON "Webhook"("reportSlug");

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_reportSlug_fkey" FOREIGN KEY ("reportSlug") REFERENCES "Report"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
