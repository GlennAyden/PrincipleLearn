/*
  Warnings:

  - Added the required column `content` to the `JurnalRefleksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `JurnalRefleksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtopic` to the `JurnalRefleksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JurnalRefleksi" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "subtopic" TEXT NOT NULL;
