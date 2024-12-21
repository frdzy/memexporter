-- CreateEnum
CREATE TYPE "BlogImportType" AS ENUM ('LIVEJOURNAL');

-- CreateTable
CREATE TABLE "UserExample" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "UserExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogImport" (
    "id" TEXT NOT NULL,
    "rawJson" TEXT NOT NULL,
    "type" "BlogImportType" NOT NULL,

    CONSTRAINT "BlogImport_pkey" PRIMARY KEY ("id")
);
