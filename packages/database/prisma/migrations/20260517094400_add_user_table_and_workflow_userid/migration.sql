/*
  Warnings:

  - You are about to drop the column `config` on the `Node` table. All the data in the column will be lost.
  - Added the required column `configValues` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Node` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Node" DROP COLUMN "config",
ADD COLUMN     "configValues" JSONB NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "NodeCategory";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
