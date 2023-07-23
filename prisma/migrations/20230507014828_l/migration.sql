-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "serviceType" TEXT[];

-- CreateTable
CREATE TABLE "ExcludedDays" (
    "id" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3),

    CONSTRAINT "ExcludedDays_pkey" PRIMARY KEY ("id")
);
