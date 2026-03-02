-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Report_token_key" ON "Report"("token");
