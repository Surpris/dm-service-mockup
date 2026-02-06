import { PrismaClient, ProjectRole, AccessPolicy, EntityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- 1. Contributors ---
  const alice = await prisma.contributor.upsert({
    where: { contributorId: 'C-001' },
    update: {},
    create: {
      contributorId: 'C-001',
      name: 'Alice (PI)',
    },
  });

  const bob = await prisma.contributor.upsert({
    where: { contributorId: 'C-002' },
    update: {},
    create: {
      contributorId: 'C-002',
      name: 'Bob (Co-Investigator)',
    },
  });

  const carol = await prisma.contributor.upsert({
    where: { contributorId: 'C-003' },
    update: {},
    create: {
      contributorId: 'C-003',
      name: 'Carol (Data Manager)',
    },
  });

  console.log('Contributors seeded:', { alice, bob, carol });

  // --- 2. Projects ---
  const projectAlpha = await prisma.project.upsert({
    where: { projectNumber: 'P-ALPHA' },
    update: {},
    create: {
      projectNumber: 'P-ALPHA',
      description: 'AI Ethics Research Project',
      metadata: {
        create: {
          createdDate: new Date('2024-01-01'),
          lastUpdatedDate: new Date('2024-01-01'),
        },
      },
      contributors: {
        create: [
          {
            contributorId: alice.id,
            role: ProjectRole.PRINCIPAL_INVESTIGATOR,
          },
          {
            contributorId: bob.id,
            role: ProjectRole.CO_INVESTIGATOR,
          },
        ],
      },
    },
  });

  const projectBeta = await prisma.project.upsert({
    where: { projectNumber: 'P-BETA' },
    update: {},
    create: {
      projectNumber: 'P-BETA',
      description: 'Climate Change Analysis',
      contributors: {
        create: [
          {
            contributorId: carol.id,
            role: ProjectRole.DATA_MANAGER,
          },
        ],
      },
    },
  });

  console.log('Projects seeded:', { projectAlpha, projectBeta });

  // --- 3. Datasets ---
  const datasetAlpha1 = await prisma.dataset.create({
    data: {
      datasetNo: 1,
      title: 'Raw Survey Data',
      accessPolicy: AccessPolicy.PUBLIC,
      projectId: projectAlpha.id,
      collectedById: alice.id, // Collected by Alice
      collectedAt: new Date('2024-02-01'),
    },
  });

  const datasetAlpha2 = await prisma.dataset.create({
    data: {
      datasetNo: 2,
      title: 'Analyzing Script',
      accessPolicy: AccessPolicy.SHARED,
      projectId: projectAlpha.id,
      collectedById: bob.id, // Collected by Bob
      managedById: carol.id, // Managed by Carol
      managedFrom: new Date('2024-02-15'),
    },
  });

  const datasetBeta1 = await prisma.dataset.create({
    data: {
      datasetNo: 1,
      title: 'Satellite Images',
      accessPolicy: AccessPolicy.CLOSED,
      projectId: projectBeta.id,
      collectedById: carol.id, // Collected by Carol
    },
  });

  console.log('Datasets seeded:', { datasetAlpha1, datasetAlpha2, datasetBeta1 });

  // --- 4. User Defined Relationships (Optional / Example) ---
  // Example: Dataset Alpha-2 is DERIVED_FROM Dataset Alpha-1
  await prisma.userDefinedRelationship.create({
      data: {
          relationshipType: 'DERIVED_FROM',
          sourceId: datasetAlpha2.id,
          sourceType: EntityType.DATASET,
          targetId: datasetAlpha1.id,
          targetType: EntityType.DATASET,
          properties: {
              method: 'Statistical Analysis',
              tool: 'R v4.1'
          },
          createdBy: 'system-seed'
      }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
