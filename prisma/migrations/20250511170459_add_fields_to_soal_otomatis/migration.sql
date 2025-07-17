/*
  Warnings:

  - Added the required column `courseId` to the `SoalOtomatis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtopic` to the `SoalOtomatis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoalOtomatis" ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "subtopic" TEXT NOT NULL;
