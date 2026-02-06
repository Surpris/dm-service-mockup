import { Test, TestingModule } from '@nestjs/testing';
import { DatasetService } from './dataset.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatasetInput, UpdateDatasetInput } from './dto/dataset.input';

const mockPrismaClient = {
  dataset: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('DatasetService', () => {
  let service: DatasetService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DatasetService,
        {
          provide: PrismaService,
          useValue: {
            client: mockPrismaClient,
          },
        },
      ],
    }).compile();

    service = module.get<DatasetService>(DatasetService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.dataset.create with correct data', async () => {
      const input: CreateDatasetInput = {
        title: 'New Dataset',
        datasetNo: 1,
        accessPolicy: 'PUBLIC',
        projectId: 'p1',
        collectedById: 'c1',
      };
      const expectedResult = { id: 'uuid', ...input };
      mockPrismaClient.dataset.create.mockResolvedValue(expectedResult);

      const result = await service.create(input);

      expect(mockPrismaClient.dataset.create).toHaveBeenCalledWith({
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call prisma.dataset.findMany with deletedAt: null', async () => {
      const expectedResult = [{ id: '1', name: 'D1' }];
      mockPrismaClient.dataset.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaClient.dataset.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call prisma.dataset.findFirst with id and deletedAt: null', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'D1' };
      mockPrismaClient.dataset.findFirst.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockPrismaClient.dataset.findFirst).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });

    it('should return null if not found', async () => {
      const id = 'uuid-non-existent';
      mockPrismaClient.dataset.findFirst.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should call prisma.dataset.update with correct params', async () => {
      const id = 'uuid-1';
      const input: UpdateDatasetInput = { title: 'Updated' };
      const expectedResult = { id, name: 'Updated' };
      mockPrismaClient.dataset.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, input);

      expect(mockPrismaClient.dataset.update).toHaveBeenCalledWith({
        where: { id },
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call prisma.dataset.update with deletedAt for soft delete', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockPrismaClient.dataset.update.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaClient.dataset.update).toHaveBeenCalledWith({
        where: { id },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toBe(expectedResult);
    });
  });
});
