import { Test, TestingModule } from '@nestjs/testing';
import { UserDefinedRelationshipService } from './user-defined-relationship.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDefinedRelationshipInput } from './dto/create-user-defined-relationship.input';

const mockPrismaService = {
  client: {
    userDefinedRelationship: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
    dataset: {
      findFirst: jest.fn(),
    },
    contributor: {
      findFirst: jest.fn(),
    },
  },
};

describe('UserDefinedRelationshipService', () => {
  let service: UserDefinedRelationshipService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDefinedRelationshipService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserDefinedRelationshipService>(
      UserDefinedRelationshipService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a relationship', async () => {
      const input: CreateUserDefinedRelationshipInput = {
        relationshipType: 'RELATED_TO',
        sourceId: 'src-1',
        sourceType: 'PROJECT',
        targetId: 'tgt-1',
        targetType: 'DATASET',
        createdBy: 'user-1',
        properties: JSON.stringify({ note: 'test' }),
      };

      const expectedResult = {
        id: 'uuid',
        ...input,
        createdAt: new Date(),
        deletedAt: null,
      };

      (
        prisma.client.userDefinedRelationship.create as jest.Mock
      ).mockResolvedValue(expectedResult);
      (prisma.client.project.findFirst as jest.Mock).mockResolvedValue({
        id: 'src-1',
      });
      (prisma.client.dataset.findFirst as jest.Mock).mockResolvedValue({
        id: 'tgt-1',
      });

      const result = await service.create(input);
      expect(result).toEqual(expectedResult);
      expect(prisma.client.userDefinedRelationship.create).toHaveBeenCalledWith(
        {
          data: input,
        },
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of relationships', async () => {
      const expectedResult = [{ id: 'uuid', relationshipType: 'test' }];
      (
        prisma.client.userDefinedRelationship.findMany as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(result).toEqual(expectedResult);
      expect(
        prisma.client.userDefinedRelationship.findMany,
      ).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('findOne', () => {
    it('should return a relationship by id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, relationshipType: 'test' };
      (
        prisma.client.userDefinedRelationship.findFirst as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await service.findOne(id);
      expect(result).toEqual(expectedResult);
      expect(
        prisma.client.userDefinedRelationship.findFirst,
      ).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
    });

    it('should return null if not found', async () => {
      const id = 'not-found';
      (
        prisma.client.userDefinedRelationship.findFirst as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.findOne(id);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a relationship', async () => {
      const id = 'uuid-1';
      const input = { id, relationshipType: 'UPDATED' };
      const expectedResult = { id, relationshipType: 'UPDATED' };
      (
        prisma.client.userDefinedRelationship.update as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await service.update(id, input);
      expect(result).toEqual(expectedResult);
      const { id: _unused, ...data } = input;
      expect(prisma.client.userDefinedRelationship.update).toHaveBeenCalledWith(
        {
          where: { id },
          data,
        },
      );
    });

    it('should throw error if not found during update', async () => {
      const id = 'not-found';
      (
        prisma.client.userDefinedRelationship.update as jest.Mock
      ).mockRejectedValue(new Error('Not found'));

      await expect(service.update(id, { id })).rejects.toThrow('Not found');
    });
  });

  describe('remove', () => {
    it('should soft delete a relationship', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      (
        prisma.client.userDefinedRelationship.update as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await service.remove(id);
      expect(result).toEqual(expectedResult);
      expect(prisma.client.userDefinedRelationship.update).toHaveBeenCalledWith(
        {
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            deletedAt: expect.any(Date),
          },
        },
      );
    });

    it('should throw error if not found during removal', async () => {
      const id = 'not-found';
      (
        prisma.client.userDefinedRelationship.update as jest.Mock
      ).mockRejectedValue(new Error('Not found'));

      await expect(service.remove(id)).rejects.toThrow('Not found');
    });
  });
});
