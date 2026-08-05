/*
  Warnings:

  - You are about to drop the `Land` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `ArchitectureCompany` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avatarUrl` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetRangeLabel` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImageUrl` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationLabel` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCount` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewCount` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsExperience` to the `ArchitectureCompany` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ConstructionStatus" AS ENUM ('DONE', 'ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "ArchitectureCompany" ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "awardsWon" INTEGER,
ADD COLUMN     "budgetRangeLabel" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "clientSatisfactionPct" INTEGER,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Sri Lanka',
ADD COLUMN     "coverImageUrl" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "locationLabel" TEXT NOT NULL,
ADD COLUMN     "projectCount" INTEGER NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviewCount" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearsExperience" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Land";

-- CreateTable
CREATE TABLE "CompanySpecialization" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanySpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirmService" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FirmService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirmTeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FirmTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirmTestimonial" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FirmTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseDesign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "priceLkr" INTEGER NOT NULL,
    "architectName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "sqftArea" INTEGER NOT NULL,
    "locationLabel" TEXT NOT NULL,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "HouseDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseDesignTag" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "HouseDesignTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignDetail" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "breadcrumb" TEXT[],
    "architectName" TEXT NOT NULL,
    "architectFirm" TEXT NOT NULL,
    "locationLabel" TEXT NOT NULL,
    "completionYear" INTEGER NOT NULL,
    "status" "DesignStatus" NOT NULL DEFAULT 'PLANNING',
    "heroImageUrl" TEXT NOT NULL,
    "threeDVisualizationUrl" TEXT,
    "priceLkr" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "sqftArea" INTEGER NOT NULL,
    "garageSpaces" INTEGER NOT NULL DEFAULT 0,
    "overview" TEXT NOT NULL,
    "designStyle" TEXT,
    "structureType" TEXT,
    "interiorFinish" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignGalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "DesignGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorPlan" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "FloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignFeature" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "DesignFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionPhase" (
    "id" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" "ConstructionStatus" NOT NULL DEFAULT 'PENDING',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "designDetailId" TEXT NOT NULL,

    CONSTRAINT "ConstructionPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignReview" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "reviewDate" TEXT NOT NULL,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "DesignReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedProject" (
    "id" TEXT NOT NULL,
    "targetDesignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "priceLkr" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "detailId" TEXT NOT NULL,

    CONSTRAINT "RelatedProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanySpecialization_companyId_idx" ON "CompanySpecialization"("companyId");

-- CreateIndex
CREATE INDEX "FirmService_companyId_idx" ON "FirmService"("companyId");

-- CreateIndex
CREATE INDEX "FirmTeamMember_companyId_idx" ON "FirmTeamMember"("companyId");

-- CreateIndex
CREATE INDEX "FirmTestimonial_companyId_idx" ON "FirmTestimonial"("companyId");

-- CreateIndex
CREATE INDEX "HouseDesign_companyId_idx" ON "HouseDesign"("companyId");

-- CreateIndex
CREATE INDEX "HouseDesign_style_idx" ON "HouseDesign"("style");

-- CreateIndex
CREATE INDEX "HouseDesign_priceLkr_idx" ON "HouseDesign"("priceLkr");

-- CreateIndex
CREATE INDEX "HouseDesignTag_designId_idx" ON "HouseDesignTag"("designId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignDetail_designId_key" ON "DesignDetail"("designId");

-- CreateIndex
CREATE INDEX "DesignGalleryImage_detailId_idx" ON "DesignGalleryImage"("detailId");

-- CreateIndex
CREATE INDEX "FloorPlan_detailId_idx" ON "FloorPlan"("detailId");

-- CreateIndex
CREATE INDEX "DesignFeature_detailId_idx" ON "DesignFeature"("detailId");

-- CreateIndex
CREATE INDEX "ConstructionPhase_designDetailId_idx" ON "ConstructionPhase"("designDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignReview_detailId_key" ON "DesignReview"("detailId");

-- CreateIndex
CREATE INDEX "RelatedProject_detailId_idx" ON "RelatedProject"("detailId");

-- CreateIndex
CREATE UNIQUE INDEX "ArchitectureCompany_email_key" ON "ArchitectureCompany"("email");

-- AddForeignKey
ALTER TABLE "CompanySpecialization" ADD CONSTRAINT "CompanySpecialization_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ArchitectureCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FirmService" ADD CONSTRAINT "FirmService_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ArchitectureCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FirmTeamMember" ADD CONSTRAINT "FirmTeamMember_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ArchitectureCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FirmTestimonial" ADD CONSTRAINT "FirmTestimonial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ArchitectureCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseDesign" ADD CONSTRAINT "HouseDesign_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ArchitectureCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseDesignTag" ADD CONSTRAINT "HouseDesignTag_designId_fkey" FOREIGN KEY ("designId") REFERENCES "HouseDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignDetail" ADD CONSTRAINT "DesignDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "HouseDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignGalleryImage" ADD CONSTRAINT "DesignGalleryImage_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorPlan" ADD CONSTRAINT "FloorPlan_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignFeature" ADD CONSTRAINT "DesignFeature_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionPhase" ADD CONSTRAINT "ConstructionPhase_designDetailId_fkey" FOREIGN KEY ("designDetailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignReview" ADD CONSTRAINT "DesignReview_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedProject" ADD CONSTRAINT "RelatedProject_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DesignDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
