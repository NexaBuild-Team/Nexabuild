/*
  Warnings:

  - Made the column `description` on table `Land` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Land" ALTER COLUMN "description" SET NOT NULL;
