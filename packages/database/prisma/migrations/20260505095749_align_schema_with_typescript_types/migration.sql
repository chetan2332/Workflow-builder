/*
  Warnings:

  - You are about to drop the column `meta` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the column `actionState` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `templateVersion` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the `NodeTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `config` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputHandles` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputHandles` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Made the column `label` on table `Node` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NodeCategory" AS ENUM ('TRIGGER', 'CODE', 'FLOW');

-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_templateId_templateVersion_fkey";

-- DropIndex
DROP INDEX "Edge_sourceNodeId_idx";

-- DropIndex
DROP INDEX "Edge_targetNodeId_idx";

-- DropIndex
DROP INDEX "Node_templateId_templateVersion_idx";

-- DropIndex
DROP INDEX "Workflow_status_updatedAt_idx";

-- AlterTable
ALTER TABLE "Edge" DROP COLUMN "meta";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "actionState",
DROP COLUMN "templateId",
DROP COLUMN "templateVersion",
ADD COLUMN     "category" "NodeCategory" NOT NULL,
ADD COLUMN     "config" JSONB NOT NULL,
ADD COLUMN     "configHandles" JSONB,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "inputHandles" JSONB NOT NULL,
ADD COLUMN     "outputHandles" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "label" SET NOT NULL;

-- DropTable
DROP TABLE "NodeTemplate";

-- DropEnum
DROP TYPE "NodeShape";

-- DropEnum
DROP TYPE "NodeType";
