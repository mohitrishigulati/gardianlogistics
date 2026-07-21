-- CreateTable
CREATE TABLE "OrderReview" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderReview_bookingId_key" ON "OrderReview"("bookingId");

-- AddForeignKey
ALTER TABLE "OrderReview" ADD CONSTRAINT "OrderReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "ShipmentBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
