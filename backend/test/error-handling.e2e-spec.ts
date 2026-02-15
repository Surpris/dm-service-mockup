import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

interface GqlRes<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

describe('Error Handling (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Soft Deleted Projects', () => {
    let projectId: string;

    beforeEach(async () => {
      // Create a project to be deleted
      const createProjectQuery = `
        mutation {
          createProject(createProjectInput: {
            projectNumber: "ERR-TEST-${Date.now()}",
            description: "To be deleted"
          }) {
            id
          }
        }
      `;
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createProjectQuery });
      const body = res.body as { data: { createProject: { id: string } } };
      projectId = body.data.createProject.id;

      // Soft delete it
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation { removeProject(id: "${projectId}") { id } }`,
        });
    });

    it('should return null when accessing a deleted project via findOne', async () => {
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

      const body = res.body as GqlRes<{ project: any }>;
      expect(body.data.project).toBeNull();
    });

    it('should not include deleted projects in findAll', async () => {
      const query = `
        query {
          projects {
            id
          }
        }
      `;
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = res.body as GqlRes<{ projects: Array<{ id: string }> }>;
      const projects = body.data.projects;
      expect(projects.find((p) => p.id === projectId)).toBeUndefined();
    });

    it('should return an error when attempting to update a deleted (non-existent from Prisma viewpoint) project', async () => {
      const query = `
        mutation {
          updateProject(id: "${projectId}", updateProjectInput: {
            description: "Attempted update"
          }) {
            id
          }
        }
      `;
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = res.body as GqlRes<any>;
      expect(body.errors).toBeDefined();
    });
  });

  describe('Invalid Relationships', () => {
    it('should return an error when attempting to create a relationship between non-existent entities', async () => {
      const nonExistentId1 = '00000000-0000-0000-0000-000000000001';
      const nonExistentId2 = '00000000-0000-0000-0000-000000000002';

      const query = `
        mutation {
          createUserDefinedRelationship(input: {
            sourceId: "${nonExistentId1}",
            sourceType: PROJECT,
            targetId: "${nonExistentId2}",
            targetType: DATASET,
            relationshipType: "INVALID_TEST",
            createdBy: "Tester"
          }) {
            id
          }
        }
      `;

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const body = res.body as GqlRes<any>;
      expect(body.errors).toBeDefined();
      expect(body.errors![0].message).toContain(
        'PROJECT with ID 00000000-0000-0000-0000-000000000001 not found or has been deleted',
      );
    });
  });
});
