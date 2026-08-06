/*
  Warnings:

  - You are about to drop the column `badge` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `electricityAccess` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `investmentScore` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `landType` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `matchScore` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `roadAccess` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `waterAccess` on the `Land` table. All the data in the column will be lost.
  - The `sqft` column on the `Land` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `facing` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgMain` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgSec` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerPerch` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roadFrontage` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shape` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrain` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleType` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utilities` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `Land` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `perches` on the `Land` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Land" DROP COLUMN "badge",
DROP COLUMN "electricityAccess",
DROP COLUMN "investmentScore",
DROP COLUMN "landType",
DROP COLUMN "matchScore",
DROP COLUMN "roadAccess",
DROP COLUMN "waterAccess",
ADD COLUMN     "agent" JSONB,
ADD COLUMN     "allImages" TEXT[],
ADD COLUMN     "badges" TEXT[],
ADD COLUMN     "facing" TEXT NOT NULL,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "hospitals" JSONB,
ADD COLUMN     "imgMain" TEXT NOT NULL,
ADD COLUMN     "imgSec" TEXT NOT NULL,
ADD COLUMN     "mapImg" TEXT,
ADD COLUMN     "pricePerPerch" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "reasons" TEXT[],
ADD COLUMN     "roadFrontage" TEXT NOT NULL,
ADD COLUMN     "schools" JSONB,
ADD COLUMN     "shape" TEXT NOT NULL,
ADD COLUMN     "supermarkets" JSONB,
ADD COLUMN     "terrain" TEXT NOT NULL,
ADD COLUMN     "titleType" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "utilities" TEXT NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
DROP COLUMN "perches",
ADD COLUMN     "perches" DOUBLE PRECISION NOT NULL,
DROP COLUMN "sqft",
ADD COLUMN     "sqft" DOUBLE PRECISION;
