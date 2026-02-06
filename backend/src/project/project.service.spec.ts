import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.input';

const mockPrismaClient = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('ProjectService', () => {
  let service: ProjectService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: {
            client: mockPrismaClient,
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.project.create with correct data', async () => {
      const input: CreateProjectInput = {
        projectNumber: 'PRJ-001',
        description: 'Test Project',
      };
      const expectedResult = { id: 'uuid', ...input };
      mockPrismaClient.project.create.mockResolvedValue(expectedResult);

      const result = await service.create(input);

      expect(mockPrismaClient.project.create).toHaveBeenCalledWith({
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call prisma.project.findMany with deletedAt: null', async () => {
      const expectedResult = [{ id: '1', name: 'P1' }];
      mockPrismaClient.project.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaClient.project.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call prisma.project.findFirst with id and deletedAt: null', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'P1' };
      mockPrismaClient.project.findFirst.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockPrismaClient.project.findFirst).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
      expect(result).toBe(expectedResult);
    });

    it('should return null if not found', async () => {
      const id = 'uuid-non-existent';
      mockPrismaClient.project.findFirst.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should call prisma.project.update with correct params', async () => {
      const id = 'uuid-1';
      const input: UpdateProjectInput = { projectNumber: 'PRJ-UPDATED' };
      const expectedResult = { id, name: 'Updated' };
      mockPrismaClient.project.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, input);

      expect(mockPrismaClient.project.update).toHaveBeenCalledWith({
        where: { id },
        data: input,
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call prisma.project.update with deletedAt for soft delete', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockPrismaClient.project.update.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaClient.project.update).toHaveBeenCalledWith({
        where: { id },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toBe(expectedResult);
    });
  });
});
