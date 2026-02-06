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
});
