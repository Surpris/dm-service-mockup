import { Test, TestingModule } from '@nestjs/testing';
import { GraphResolver } from './graph.resolver';
import { GraphService } from './graph.service';
import { GraphData, NodeType } from './dto/graph.model';

describe('GraphResolver', () => {
  let resolver: GraphResolver;
  let module: TestingModule;

  const mockGraphService = {
    getGraphData: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GraphResolver,
        {
          provide: GraphService,
          useValue: mockGraphService,
        },
      ],
    }).compile();

    resolver = module.get<GraphResolver>(GraphResolver);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('graph', () => {
    it('should call graphService.getGraphData', async () => {
      const expectedResult: GraphData = {
        nodes: [{ id: '1', type: NodeType.PROJECT, label: 'P1' }],
        edges: [],
      };
      mockGraphService.getGraphData.mockResolvedValue(expectedResult);

      const result = await resolver.graph('test-filter');

      expect(mockGraphService.getGraphData).toHaveBeenCalledWith('test-filter');
      expect(result).toBe(expectedResult);
    });

    it('should call graphService.getGraphData without filter', async () => {
      const expectedResult: GraphData = {
        nodes: [],
        edges: [],
      };
      mockGraphService.getGraphData.mockResolvedValue(expectedResult);

      const result = await resolver.graph();

      expect(mockGraphService.getGraphData).toHaveBeenCalledWith(undefined);
      expect(result).toBe(expectedResult);
    });
  });
});