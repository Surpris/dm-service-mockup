
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Projects (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Direct DB connection for verification
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  let projectId: string;
  const projectNumber = `PN-${Date.now()}`; // Ensure uniqueness

  it('Create Project', async () => {
    const query = `
      mutation {
        createProject(createProjectInput: {
          projectNumber: "${projectNumber}",
          description: "E2E Test Project"
        }) {
          id
          projectNumber
          description
          createdAt
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const data = res.body.data.createProject;
    projectId = data.id;

    expect(data.projectNumber).toBe(projectNumber);
    expect(data.description).toBe('E2E Test Project');
    // Check if ID is UUID v7 (simple regex check for UUID format, strictly verifying v7 might be complex but length/format is good start)
    expect(data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('Read Project', async () => {
    const query = `
      query {
        project(id: "${projectId}") {
          id
          projectNumber
          description
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const data = res.body.data.project;
    expect(data.id).toBe(projectId);
    expect(data.projectNumber).toBe(projectNumber);
  });

  it('Update Project', async () => {
    const query = `
      mutation {
        updateProject(id: "${projectId}", updateProjectInput: {
          description: "Updated Description"
        }) {
          id
          description
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const data = res.body.data.updateProject;
    expect(data.id).toBe(projectId);
    expect(data.description).toBe('Updated Description');
  });

  it('Delete Project', async () => {
    const query = `
      mutation {
        removeProject(id: "${projectId}") {
          id
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const data = res.body.data.removeProject;
    expect(data.id).toBe(projectId);
  });

  it('Verify Deletion (API)', async () => {
    const query = `
      query {
        project(id: "${projectId}") {
          id
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    // Expecting null or error depending on implementation. 
    // Usually 'project' query returns null if not found.
    expect(res.body.data.project).toBeNull();
  });

  it('Verify Logical Deletion (DB)', async () => {
    // Check directly in DB
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    expect(project).toBeDefined();
    expect(project?.id).toBe(projectId);
    expect(project?.deletedAt).not.toBeNull();
    // deletedAt should be a Date object or valid date string
    expect(new Date(project!.deletedAt!).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
