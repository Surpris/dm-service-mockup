import { Test, TestingModule } from '@nestjs/testing';
import { UserDefinedRelationshipResolver } from './user-defined-relationship.resolver';
import { UserDefinedRelationshipService } from './user-defined-relationship.service';
import {
  CreateUserDefinedRelationshipInput,
  UpdateUserDefinedRelationshipInput,
} from './dto/create-user-defined-relationship.input';

describe('UserDefinedRelationshipResolver', () => {
  let resolver: UserDefinedRelationshipResolver;
  let module: TestingModule;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserDefinedRelationshipResolver,
        {
          provide: UserDefinedRelationshipService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<UserDefinedRelationshipResolver>(
      UserDefinedRelationshipResolver,
    );
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUserDefinedRelationship', () => {
    it('should call service.create', async () => {
      const input: CreateUserDefinedRelationshipInput = {
        sourceId: 'src-1',
        sourceType: 'PROJECT',
        targetId: 'tgt-1',
        targetType: 'DATASET',
        relationshipType: 'RELATED_TO',
        createdBy: 'user-1',
      };
      const expectedResult = { id: 'ur-1', ...input };
      mockService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createUserDefinedRelationship(input);

      expect(mockService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('userDefinedRelationships', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: 'ur-1' }];
      mockService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.userDefinedRelationships();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('userDefinedRelationship', () => {
    it('should call service.findOne', async () => {
      const id = 'ur-1';
      const expectedResult = { id };
      mockService.findOne.mockResolvedValue(expectedResult);

      const result = await resolver.userDefinedRelationship(id);

      expect(mockService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateUserDefinedRelationship', () => {
    it('should call service.update', async () => {
      const input: UpdateUserDefinedRelationshipInput = {
        id: 'ur-1',
        relationshipType: 'UPDATED_RELATION',
      };
      const expectedResult = {
        id: 'ur-1',
        relationshipType: 'UPDATED_RELATION',
      };
      mockService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateUserDefinedRelationship(input);

      expect(mockService.update).toHaveBeenCalledWith(input.id, input);
      expect(result).toBe(expectedResult);
    });

    it('should throw error if service.update fails', async () => {
      const input: UpdateUserDefinedRelationshipInput = { id: 'ur-1' };
      mockService.update.mockRejectedValue(new Error('Update failed'));

      await expect(
        resolver.updateUserDefinedRelationship(input),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('removeUserDefinedRelationship', () => {
    it('should call service.remove', async () => {
      const id = 'ur-1';
      const expectedResult = { id };
      mockService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.removeUserDefinedRelationship(id);

      expect(mockService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });

    it('should throw error if service.remove fails', async () => {
      const id = 'ur-1';
      mockService.remove.mockRejectedValue(new Error('Remove failed'));

      await expect(resolver.removeUserDefinedRelationship(id)).rejects.toThrow(
        'Remove failed',
      );
    });
  });
});
