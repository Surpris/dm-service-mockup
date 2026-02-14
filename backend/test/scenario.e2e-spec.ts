import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Scenario Test (e2e)', () => {
  let app: INestApplication;
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

  // Test Data Identifiers
  const projectNumber = `PN-SCENARIO-${Date.now()}`;
  const contributorIdRef = `CN-SCENARIO-${Date.now()}`;
  const datasetTitle = `DS-SCENARIO-${Date.now()}`;

  // Created IDs
  let projectId: string;
  let contributorId: string;
  let datasetId: string;
  let relationshipId: string;

  it('1. Create Project, Contributor, and Dataset', async () => {
    // 1-1. Create Project
    const createProjectQuery = `
      mutation {
        createProject(createProjectInput: {
          projectNumber: "${projectNumber}",
          description: "Scenario Test Project"
        }) {
          id
          projectNumber
        }
      }
    `;
    const projectRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createProjectQuery })
      .expect(200);

    const projectData = projectRes.body.data.createProject;
    projectId = projectData.id;
    expect(projectData.projectNumber).toBe(projectNumber);

    // 1-2. Create Contributor
    const createContributorQuery = `
      mutation {
        createContributor(createContributorInput: {
          contributorId: "${contributorIdRef}",
          name: "Scenario Test User"
        }) {
          id
          contributorId
        }
      }
    `;
    const contributorRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createContributorQuery })
      .expect(200);

    const contributorData = contributorRes.body.data.createContributor;
    contributorId = contributorData.id;
    expect(contributorData.contributorId).toBe(contributorIdRef);

    // 1-3. Create Dataset (linked to Project and Contributor)
    const createDatasetQuery = `
      mutation {
        createDataset(createDatasetInput: {
          projectId: "${projectId}",
          collectedById: "${contributorId}",
          datasetNo: 1,
          title: "${datasetTitle}",
          accessPolicy: PUBLIC
        }) {
          id
          title
        }
      }
    `;
    const datasetRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createDatasetQuery })
      .expect(200);

    const datasetData = datasetRes.body.data.createDataset;
    datasetId = datasetData.id;
    expect(datasetData.title).toBe(datasetTitle);
  });

  it('2. Create User Defined Relationship', async () => {
    // Create relationship: Project -> Contributor (e.g., "MaintainedBy")
    const createRelationshipQuery = `
      mutation {
        createUserDefinedRelationship(input: {
          sourceId: "${projectId}",
          sourceType: PROJECT,
          targetId: "${contributorId}",
          targetType: CONTRIBUTOR,
          relationshipType: "MaintainedBy",
          createdBy: "Admin"
        }) {
          id
          relationshipType
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createRelationshipQuery })
      .expect(200);

    const data = res.body.data.createUserDefinedRelationship;
    relationshipId = data.id;
    expect(data.relationshipType).toBe('MaintainedBy');
  });

  it('3. Check Graph', async () => {
    const graphQuery = `
      query {
        graph {
          nodes {
            id
            label
            type
          }
          edges {
            id
            source
            target
            type
            label
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: graphQuery })
      .expect(200);

    const graph = res.body.data.graph;

    // Verify Nodes exist
    const projectNode = graph.nodes.find((n) => n.id === projectId);
    const contributorNode = graph.nodes.find((n) => n.id === contributorId);
    const datasetNode = graph.nodes.find((n) => n.id === datasetId);

    expect(projectNode).toBeDefined();
    expect(projectNode.type).toBe('PROJECT');
    expect(contributorNode).toBeDefined();
    expect(contributorNode.type).toBe('CONTRIBUTOR');
    expect(datasetNode).toBeDefined();
    expect(datasetNode.type).toBe('DATASET');

    // Verify Edges exist
    // 1. Built-in: Dataset -> Project (BELONGS_TO or similar, implicit in schema logic, explicit in graph service)
    // Note: The graph service logic for default edges needs to be verified.
    // Assuming standard "Dataset belongs to Project" and "Dataset collected by Contributor".

    // 2. User Defined: Project -> Contributor (MaintainedBy)
    const userEdge = graph.edges.find((e) => e.id === relationshipId);
    expect(userEdge).toBeDefined();
    expect(userEdge.source).toBe(projectId);
    expect(userEdge.target).toBe(contributorId);
    expect(userEdge.type).toBe('MaintainedBy'); // Or "USER_DEFINED" depending on implementation detail, checking label or type
  });

  it('4. Cleanup (Delete Resources)', async () => {
    // Delete User Defined Relationship
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation { removeUserDefinedRelationship(id: "${relationshipId}") { id } }`,
      })
      .expect(200);

    // Delete Dataset
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation { removeDataset(id: "${datasetId}") { id } }`,
      })
      .expect(200);

    // Delete Contributor
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation { removeContributor(id: "${contributorId}") { id } }`,
      })
      .expect(200);

    // Delete Project
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation { removeProject(id: "${projectId}") { id } }`,
      })
      .expect(200);
  });

  it('5. Verify Deletion in Graph', async () => {
    const graphQuery = `
      query {
        graph {
          nodes {
            id
          }
          edges {
            id
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: graphQuery })
      .expect(200);

    const graph = res.body.data.graph;

    // Nodes should be gone (or not returned if soft deleted and filtered out)
    const projectNode = graph.nodes.find((n) => n.id === projectId);
    const contributorNode = graph.nodes.find((n) => n.id === contributorId);
    const datasetNode = graph.nodes.find((n) => n.id === datasetId);

    expect(projectNode).toBeUndefined();
    expect(contributorNode).toBeUndefined();
    expect(datasetNode).toBeUndefined();
  });
});
