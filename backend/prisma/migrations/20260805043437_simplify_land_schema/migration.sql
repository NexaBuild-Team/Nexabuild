/*
  Warnings:

  - You are about to drop the column `agent` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `allImages` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `badges` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `facing` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `highlights` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `hospitals` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `imgMain` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `imgSec` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `mapImg` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerPerch` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `reasons` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `roadFrontage` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `schools` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `shape` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `supermarkets` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `terrain` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `titleType` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `utilities` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `zoning` on the `Land` table. All the data in the column will be lost.
  - Added the required column `landType` to the `Land` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Land" DROP COLUMN "agent",
DROP COLUMN "allImages",
DROP COLUMN "badges",
DROP COLUMN "facing",
DROP COLUMN "highlights",
DROP COLUMN "hospitals",
DROP COLUMN "img",
DROP COLUMN "imgMain",
DROP COLUMN "imgSec",
DROP COLUMN "mapImg",
DROP COLUMN "pricePerPerch",
DROP COLUMN "province",
DROP COLUMN "rank",
DROP COLUMN "reasons",
DROP COLUMN "roadFrontage",
DROP COLUMN "schools",
DROP COLUMN "shape",
DROP COLUMN "supermarkets",
DROP COLUMN "terrain",
DROP COLUMN "titleType",
DROP COLUMN "type",
DROP COLUMN "utilities",
DROP COLUMN "zoning",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "landType" TEXT NOT NULL,
ADD COLUMN     "matchScore" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;
