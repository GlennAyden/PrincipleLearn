/*
  Warnings:

  - You are about to drop the column `courseId` on the `SoalOtomatis` table. All the data in the column will be lost.
  - You are about to drop the column `subtopic` on the `SoalOtomatis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SoalOtomatis" DROP COLUMN "courseId",
DROP COLUMN "subtopic";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;
