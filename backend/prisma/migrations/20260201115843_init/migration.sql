-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('PRINCIPAL_INVESTIGATOR', 'CO_INVESTIGATOR', 'DATA_COLLECTOR', 'DATA_MANAGER');

-- CreateEnum
CREATE TYPE "AccessPolicy" AS ENUM ('PUBLIC', 'SHARED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PROJECT', 'DATASET', 'CONTRIBUTOR');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DMPMetadata" (
    "id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "DMPMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectContributor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL,

    CONSTRAINT "ProjectContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL,
    "datasetNo" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "accessPolicy" "AccessPolicy" NOT NULL,
    "projectId" TEXT NOT NULL,
    "collectedById" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3),
    "managedById" TEXT,
    "managedFrom" TIMESTAMP(3),
    "managedTo" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDefinedRelationship" (
    "id" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" "EntityType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "EntityType" NOT NULL,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserDefinedRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectNumber_key" ON "Project"("projectNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DMPMetadata_projectId_key" ON "DMPMetadata"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_contributorId_key" ON "Contributor"("contributorId");

-- CreateIndex
CREATE INDEX "UserDefinedRelationship_sourceId_sourceType_idx" ON "UserDefinedRelationship"("sourceId", "sourceType");

-- CreateIndex
CREATE INDEX "UserDefinedRelationship_targetId_targetType_idx" ON "UserDefinedRelationship"("targetId", "targetType");

-- AddForeignKey
ALTER TABLE "DMPMetadata" ADD CONSTRAINT "DMPMetadata_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContributor" ADD CONSTRAINT "ProjectContributor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContributor" ADD CONSTRAINT "ProjectContributor_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_collectedById_fkey" FOREIGN KEY ("collectedById") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
