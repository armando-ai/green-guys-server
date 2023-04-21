/*
  Warnings:

  - You are about to drop the column `service` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_addressId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "service";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Customer";
