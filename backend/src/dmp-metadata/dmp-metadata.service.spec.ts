import { Test, TestingModule } from '@nestjs/testing';
import { DMPMetadataService } from './dmp-metadata.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDMPMetadataInput } from './dto/create-dmp-metadata.input';
import { UpdateDMPMetadataInput } from './dto/update-dmp-metadata.input';

const mockPrismaClient = {
  dMPMetadata: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('DMPMetadataService', () => {
  let service: DMPMetadataService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DMPMetadataService,
        {
          provide: PrismaService,
          useValue: {
            client: mockPrismaClient,
          },
        },
      ],
    }).compile();

    service = module.get<DMPMetadataService>(DMPMetadataService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.dMPMetadata.create with correct data', async () => {
      const input: CreateDMPMetadataInput = {
        projectId: 'proj-1',
      };
      const expectedResult = {
        id: 'dmp-1',
        ...input,
        createdDate: new Date(),
        lastUpdatedDate: new Date(),
      };
      mockPrismaClient.dMPMetadata.create.mockResolvedValue(expectedResult);

      const result = await service.create(input);

      expect(mockPrismaClient.dMPMetadata.create).toHaveBeenCalledWith({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          createdDate: expect.any(Date),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          lastUpdatedDate: expect.any(Date),
          project: {
            connect: { id: input.projectId },
          },
        },
        include: {
          project: true,
        },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call prisma.dMPMetadata.findMany', async () => {
      const expectedResult = [{ id: 'dmp-1', projectId: 'proj-1' }];
      mockPrismaClient.dMPMetadata.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaClient.dMPMetadata.findMany).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call prisma.dMPMetadata.findUnique with correct params', async () => {
      const id = 'dmp-1';
      const expectedResult = { id, projectId: 'proj-1' };
      mockPrismaClient.dMPMetadata.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockPrismaClient.dMPMetadata.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { project: true },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('findByProjectId', () => {
    it('should call prisma.dMPMetadata.findUnique with projectId', async () => {
      const projectId = 'proj-1';
      const expectedResult = { id: 'dmp-1', projectId };
      mockPrismaClient.dMPMetadata.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findByProjectId(projectId);

      expect(mockPrismaClient.dMPMetadata.findUnique).toHaveBeenCalledWith({
        where: { projectId },
        include: { project: true },
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('update', () => {
    it('should call prisma.dMPMetadata.update with correct params', async () => {
      const id = 'dmp-1';
      const input: UpdateDMPMetadataInput = { id };
      const expectedResult = { id };
      mockPrismaClient.dMPMetadata.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, input);

      const { id: _, ...data } = input;
      expect(mockPrismaClient.dMPMetadata.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          ...data,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          lastUpdatedDate: expect.any(Date),
        },
        include: { project: true },
      });
      expect(result).toBe(expectedResult);
    });

    it('should throw error if dmp-metadata not found', async () => {
      const id = 'non-existent';
      mockPrismaClient.dMPMetadata.update.mockRejectedValue(
        new Error('Record to update not found.'),
      );

      await expect(service.update(id, { id })).rejects.toThrow(
        'Record to update not found.',
      );
    });
  });

  describe('remove', () => {
    it('should call prisma.dMPMetadata.delete with correct params', async () => {
      const id = 'dmp-1';
      const expectedResult = { id };
      mockPrismaClient.dMPMetadata.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaClient.dMPMetadata.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBe(expectedResult);
    });

    it('should throw error if dmp-metadata not found during removal', async () => {
      const id = 'non-existent';
      mockPrismaClient.dMPMetadata.delete.mockRejectedValue(
        new Error('Record to delete not found.'),
      );

      await expect(service.remove(id)).rejects.toThrow(
        'Record to delete not found.',
      );
    });
  });
});
