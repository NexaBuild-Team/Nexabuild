-- Extend the existing User table safely.

CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'AGENT', 'ARCHITECT', 'CONTRACTOR');

ALTER TABLE "User"
ADD COLUMN "avatar" TEXT,
ADD COLUMN "firstName" TEXT,
ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "password" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "User"
SET
  "password" = '$2b$10$Z7QJojZ5tw1tpoNrjjbGAeU2NDeYogn4ht3xmlyMab6BeymQnamem',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "email" = 'demo@nexabuild.com';
ALTER TABLE "User"
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
