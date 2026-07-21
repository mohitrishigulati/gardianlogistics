-- AlterTable
ALTER TABLE "Box" ADD COLUMN "slabWeightKg" INTEGER,
ADD COLUMN "referenceSlabPrice" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "RateZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countries" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL DEFAULT 'DPD Europe — Duty Paid',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateSlab" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "weightKg" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RateSlab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateSlab_zoneId_weightKg_key" ON "RateSlab"("zoneId", "weightKg");

-- AddForeignKey
ALTER TABLE "RateSlab" ADD CONSTRAINT "RateSlab_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "RateZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
