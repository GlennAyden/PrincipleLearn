-- CreateTable
CREATE TABLE "GenerateCourse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerateCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptQna" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptQna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoalOtomatis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoalOtomatis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalRefleksi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JurnalRefleksi_pkey" PRIMARY KEY ("id")
);
