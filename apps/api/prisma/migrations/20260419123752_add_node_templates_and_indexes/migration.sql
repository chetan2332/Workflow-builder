/*
  Warnings:

  - You are about to drop the column `config` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Node` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NodeShape" AS ENUM ('CIRCLE', 'OPPOSITE_D', 'ROUNDED_RECTANGLE', 'RECTANGLE_WITH_TEXT');

-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "config",
DROP COLUMN "type",
ADD COLUMN     "actionState" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "templateId" TEXT NOT NULL,
ADD COLUMN     "templateVersion" TEXT NOT NULL DEFAULT '1.0.0';

-- CreateTable
CREATE TABLE "NodeTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodeType" "NodeType" NOT NULL,
    "shape" "NodeShape" NOT NULL,
    "handlesConfig" JSONB NOT NULL,
    "actionConfig" JSONB,
    "dynamicHandles" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NodeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NodeTemplate_templateId_isActive_idx" ON "NodeTemplate"("templateId", "isActive");

-- CreateIndex
CREATE INDEX "NodeTemplate_nodeType_idx" ON "NodeTemplate"("nodeType");

-- CreateIndex
CREATE UNIQUE INDEX "NodeTemplate_templateId_version_key" ON "NodeTemplate"("templateId", "version");

-- CreateIndex
CREATE INDEX "Edge_workflowId_idx" ON "Edge"("workflowId");

-- CreateIndex
CREATE INDEX "Edge_sourceNodeId_idx" ON "Edge"("sourceNodeId");

-- CreateIndex
CREATE INDEX "Edge_targetNodeId_idx" ON "Edge"("targetNodeId");

-- CreateIndex
CREATE INDEX "Node_workflowId_idx" ON "Node"("workflowId");

-- CreateIndex
CREATE INDEX "Node_templateId_templateVersion_idx" ON "Node"("templateId", "templateVersion");

-- CreateIndex
CREATE INDEX "Workflow_status_updatedAt_idx" ON "Workflow"("status", "updatedAt");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_templateId_templateVersion_fkey" FOREIGN KEY ("templateId", "templateVersion") REFERENCES "NodeTemplate"("templateId", "version") ON DELETE RESTRICT ON UPDATE CASCADE;
