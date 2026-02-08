import { PrismaClient } from '@prisma/client';
import { createExtendedPrismaClient } from '../prisma/prisma.extension';
// import { validate, version } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const basePrisma = new PrismaClient({
    log: ['info'],
  });
  const prisma = createExtendedPrismaClient(basePrisma);

  try {
    console.log('--- Connecting ---');

    // 1. Create a Project
    console.log('--- Creating Project ---');
    const project = await prisma.project.create({
      data: {
        projectNumber: `TEST-${Date.now()}`,
        description: 'Test Project for UUID v7 and Soft Delete',
      },
    });

    console.log('Created Project:', project);

    // Verify UUID v7 (Simple check)
    if (
      project.id &&
      typeof project.id === 'string' &&
      project.id.length === 36
    ) {
      console.log('✅ UUID format looks correct (36 chars)');
    } else {
      console.error('❌ UUID format is incorrect', project.id);
    }

    // 2. Soft Delete
    console.log('--- Soft Deleting Project ---');
    await prisma.project.delete({
      where: { id: project.id },
    });
    console.log('Delete operation completed.');

    // 3. Find Unique
    console.log('--- Finding Project (Standard) ---');
    const found = await prisma.project.findUnique({
      where: { id: project.id },
    });

    if (found === null) {
      console.log(
        '✅ findUnique returned null (Soft Delete works for findUnique)',
      );
    } else {
      console.error('❌ findUnique returned record:', found);
    }

    // 4. Find Many (should be empty)
    console.log('--- Finding Project (Many) ---');
    const foundMany = await prisma.project.findMany({
      where: { id: project.id },
    });
    if (foundMany.length === 0) {
      console.log(
        '✅ findMany returned empty array (Soft Delete works for findMany)',
      );
    } else {
      console.error('❌ findMany returned records:', foundMany);
    }

    // 5. Verify Raw / Direct access (should exist with deletedAt)
    console.log('--- Verifying with Base Client ---');
    const rawRecord = await basePrisma.project.findUnique({
      where: { id: project.id },
    });
    console.log('Raw Record:', rawRecord);

    if (rawRecord && rawRecord.deletedAt) {
      console.log('✅ Raw record exists and has deletedAt set.');
    } else {
      console.error('❌ Raw record check failed.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await basePrisma.$disconnect();
  }
}

void main();
