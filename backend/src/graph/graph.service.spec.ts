import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';
import { PrismaService } from '../prisma/prisma.service';
import { NodeType, GraphEdge } from './dto/graph.model';

const mockPrismaService = {
  client: {
    project: { findMany: jest.fn() },
    dataset: { findMany: jest.fn() },
    contributor: { findMany: jest.fn() },
    projectContributor: { findMany: jest.fn() },
    userDefinedRelationship: { findMany: jest.fn() },
  },
};

describe('GraphService', () => {
  let service: GraphService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGraphData', () => {
    it('should return combined graph data', async () => {
      // Mock Data
      const projects = [
        { id: 'proj-1', projectNumber: 'P1', description: 'Project 1' },
      ];
      const datasets = [
        {
          id: 'data-1',
          title: 'Dataset 1',
          projectId: 'proj-1',
          collectedById: 'cont-1',
        },
      ];
      const contributors = [{ id: 'cont-1', name: 'Alice' }];
      const projectContributors = [
        {
          id: 'pc-1',
          projectId: 'proj-1',
          contributorId: 'cont-1',
          role: 'PI',
        },
      ];
      const userRelations = [
        {
          id: 'ur-1',
          sourceId: 'proj-1',
          sourceType: 'PROJECT',
          targetId: 'data-1',
          targetType: 'DATASET',
          relationshipType: 'RELATED_TO',
        },
      ];

      (prisma.client.project.findMany as jest.Mock).mockResolvedValue(projects);
      (prisma.client.dataset.findMany as jest.Mock).mockResolvedValue(datasets);
      (prisma.client.contributor.findMany as jest.Mock).mockResolvedValue(
        contributors,
      );
      (
        prisma.client.projectContributor.findMany as jest.Mock
      ).mockResolvedValue(projectContributors);
      (
        prisma.client.userDefinedRelationship.findMany as jest.Mock
      ).mockResolvedValue(userRelations);

      const result = await service.getGraphData();

      // Check Nodes
      expect(result.nodes).toHaveLength(3);
      expect(result.nodes).toContainEqual({
        id: 'proj-1',
        type: NodeType.PROJECT,
        label: 'Project 1',
        data: JSON.stringify({ projectNumber: 'P1' }),
      });
      expect(result.nodes).toContainEqual({
        id: 'data-1',
        type: NodeType.DATASET,
        label: 'Dataset 1',
        data: JSON.stringify({ datasetNo: undefined }),
      });
      expect(result.nodes).toContainEqual({
        id: 'cont-1',
        type: NodeType.CONTRIBUTOR,
        label: 'Alice',
        data: JSON.stringify({ contributorId: undefined }),
      });

      // Check Edges
      // 1. Project-Dataset (System)
      // 2. Dataset-Contributor (CollectedBy)
      // 3. Project-Contributor (ProjectMember)
      // 4. User Defined
      expect(result.edges.length).toBeGreaterThanOrEqual(4);

      // Verify Project -> Dataset edge
      const projDataEdge = result.edges.find(
        (e: GraphEdge) =>
          e.source === 'proj-1' &&
          e.target === 'data-1' &&
          e.type === 'HAS_DATASET',
      );
      expect(projDataEdge).toBeDefined();

      // Verify Dataset -> Contributor edge
      const dataContEdge = result.edges.find(
        (e: GraphEdge) =>
          e.source === 'data-1' &&
          e.target === 'cont-1' &&
          e.type === 'COLLECTED_BY',
      );
      expect(dataContEdge).toBeDefined();

      // Verify Project -> Contributor edge
      const projContEdge = result.edges.find(
        (e: GraphEdge) =>
          e.source === 'proj-1' &&
          e.target === 'cont-1' &&
          e.type === 'PROJECT_MEMBER',
      );
      expect(projContEdge).toBeDefined();

      // Verify User Defined Edge
      const userEdge = result.edges.find((e: GraphEdge) => e.id === 'ur-1');
      expect(userEdge).toBeDefined();
      expect(userEdge?.type).toBe('RELATED_TO');
    });

    it('should return empty graph when no data exists', async () => {
      (prisma.client.project.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.client.dataset.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.client.contributor.findMany as jest.Mock).mockResolvedValue([]);
      (
        prisma.client.projectContributor.findMany as jest.Mock
      ).mockResolvedValue([]);
      (
        prisma.client.userDefinedRelationship.findMany as jest.Mock
      ).mockResolvedValue([]);

      const result = await service.getGraphData();

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    it('should handle disconnected nodes correctly', async () => {
      const projects = [{ id: 'p1', projectNumber: 'P1', description: 'P1' }];
      const datasets = [{ id: 'd1', title: 'D1', projectId: 'other-p' }]; // D1 belongs to non-existent project in this result set

      (prisma.client.project.findMany as jest.Mock).mockResolvedValue(projects);
      (prisma.client.dataset.findMany as jest.Mock).mockResolvedValue(datasets);
      (prisma.client.contributor.findMany as jest.Mock).mockResolvedValue([]);
      (
        prisma.client.projectContributor.findMany as jest.Mock
      ).mockResolvedValue([]);
      (
        prisma.client.userDefinedRelationship.findMany as jest.Mock
      ).mockResolvedValue([]);

      const result = await service.getGraphData();

      expect(result.nodes).toHaveLength(2);
      // Edge will still be created pointing to a non-existent node in the UI's view,
      // but the service should still produce it based on the data.
      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].source).toBe('other-p');
      expect(result.edges[0].target).toBe('d1');
    });

    it('should handle circular references in user defined relationships', async () => {
      const userRelations = [
        {
          id: 'ur-1',
          sourceId: 'node-a',
          targetId: 'node-b',
          relationshipType: 'LINK',
        },
        {
          id: 'ur-2',
          sourceId: 'node-b',
          targetId: 'node-a',
          relationshipType: 'LINK',
        },
      ];

      (prisma.client.project.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.client.dataset.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.client.contributor.findMany as jest.Mock).mockResolvedValue([]);
      (
        prisma.client.projectContributor.findMany as jest.Mock
      ).mockResolvedValue([]);
      (
        prisma.client.userDefinedRelationship.findMany as jest.Mock
      ).mockResolvedValue(userRelations);

      const result = await service.getGraphData();

      expect(result.edges).toHaveLength(2);
      expect(result.edges).toContainEqual(
        expect.objectContaining({ source: 'node-a', target: 'node-b' }),
      );
      expect(result.edges).toContainEqual(
        expect.objectContaining({ source: 'node-b', target: 'node-a' }),
      );
    });
  });
});
