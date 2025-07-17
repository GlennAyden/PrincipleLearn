/*
  Warnings:

  - Added the required column `courseName` to the `GenerateCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parameter` to the `GenerateCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GenerateCourse" ADD COLUMN     "courseName" TEXT NOT NULL,
ADD COLUMN     "parameter" TEXT NOT NULL;
