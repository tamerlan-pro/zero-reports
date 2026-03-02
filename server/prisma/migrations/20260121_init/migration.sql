-- CreateTable
CREATE TABLE "TestMigration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "TestMigration_pkey" PRIMARY KEY ("id")
);
