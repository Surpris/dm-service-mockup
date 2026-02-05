import { Test, TestingModule } from '@nestjs/testing';
import { ContributorService } from './contributor.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContributorInput,
  UpdateContributorInput,
} from './dto/contributor.input';

const mockPrismaClient = {
  contributor: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('ContributorService', () => {
  let service: ContributorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributorService,
        {
          provide: PrismaService,
          useValue: {
            client: mockPrismaClient,
          },
        },
      ],
    }).compile();

    service = module.get<ContributorService>(ContributorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.contributor.create with correct data', async () => {
      const input: CreateContributorInput = {
        name: 'Test Contributor',
        email: 'test@example.com',
      };
      const expectedResult = { id: 'uuid', ...input };
      mockPrismaClient.contributor.create.mockResolvedValue(expectedResult);

      const result = await service.create(input);

      expect(mockPrismaClient.contributor.create).toHaveBeenCalledWith({
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call prisma.contributor.findMany with deletedAt: null', async () => {
      const expectedResult = [{ id: '1', name: 'C1' }];
      mockPrismaClient.contributor.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaClient.contributor.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call prisma.contributor.findFirst with id and deletedAt: null', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'C1' };
      mockPrismaClient.contributor.findFirst.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockPrismaClient.contributor.findFirst).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });

    it('should return null if not found', async () => {
      const id = 'uuid-non-existent';
      mockPrismaClient.contributor.findFirst.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should call prisma.contributor.update with correct params', async () => {
      const id = 'uuid-1';
      const input: UpdateContributorInput = { id, name: 'Updated' };
      const expectedResult = { id, name: 'Updated' };
      mockPrismaClient.contributor.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, input);

      expect(mockPrismaClient.contributor.update).toHaveBeenCalledWith({
        where: { id },
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call prisma.contributor.update with deletedAt for soft delete', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockPrismaClient.contributor.update.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaClient.contributor.update).toHaveBeenCalledWith({
        where: { id },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toBe(expectedResult);
    });
  });
});
