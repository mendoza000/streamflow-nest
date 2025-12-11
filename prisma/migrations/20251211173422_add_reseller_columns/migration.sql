-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "resellerId" TEXT;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
