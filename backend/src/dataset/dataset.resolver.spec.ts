import { Test, TestingModule } from '@nestjs/testing';
import { DatasetResolver } from './dataset.resolver';
import { DatasetService } from './dataset.service';
import { CreateDatasetInput, UpdateDatasetInput } from './dto/dataset.input';

describe('DatasetResolver', () => {
  let resolver: DatasetResolver;
  // let service: DatasetService;

  const mockDatasetService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DatasetResolver,
        {
          provide: DatasetService,
          useValue: mockDatasetService,
        },
      ],
    }).compile();

    resolver = module.get<DatasetResolver>(DatasetResolver);
    // service = module.get<DatasetService>(DatasetService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createDataset', () => {
    it('should call service.create with correct data', async () => {
      const input: CreateDatasetInput = {
        title: 'New Dataset',
        datasetNo: 1,
        accessPolicy: 'PUBLIC',
        projectId: 'p1',
        collectedById: 'c1',
      };
      const expectedResult = { id: 'uuid', ...input };
      mockDatasetService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createDataset(input);

      expect(mockDatasetService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('datasets', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Dataset 1' }];
      mockDatasetService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.findAll();

      expect(mockDatasetService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('dataset', () => {
    it('should call service.findOne with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'Dataset 1' };
      mockDatasetService.findOne.mockResolvedValue(expectedResult);

      const result = await resolver.findOne(id);

      expect(mockDatasetService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateDataset', () => {
    it('should call service.update with id and input', async () => {
      const id = 'uuid-1';
      const input: UpdateDatasetInput = { title: 'Updated' };
      const expectedResult = { id, name: 'Updated' };
      mockDatasetService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateDataset(id, input);

      expect(mockDatasetService.update).toHaveBeenCalledWith(id, input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('removeDataset', () => {
    it('should call service.remove with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockDatasetService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.removeDataset(id);

      expect(mockDatasetService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });
});
