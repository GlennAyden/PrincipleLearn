/*
  Warnings:

  - Added the required column `answer` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtopic` to the `TranscriptQna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranscriptQna" ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "subtopic" TEXT NOT NULL;
