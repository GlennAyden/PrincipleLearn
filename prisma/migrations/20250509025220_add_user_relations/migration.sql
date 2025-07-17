/*
  Warnings:

  - Added the required column `userId` to the `GenerateCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `JurnalRefleksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SoalOtomatis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GenerateCourse" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JurnalRefleksi" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SoalOtomatis" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TranscriptQna" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GenerateCourse" ADD CONSTRAINT "GenerateCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptQna" ADD CONSTRAINT "TranscriptQna_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoalOtomatis" ADD CONSTRAINT "SoalOtomatis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalRefleksi" ADD CONSTRAINT "JurnalRefleksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
