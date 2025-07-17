/*
  Warnings:

  - Added the required column `updatedAt` to the `GenerateCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JurnalRefleksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SoalOtomatis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GenerateCourse" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JurnalRefleksi" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SoalOtomatis" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TranscriptQna" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
