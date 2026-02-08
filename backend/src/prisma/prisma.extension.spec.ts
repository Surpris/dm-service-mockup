import { PrismaClient } from '@prisma/client';
import { createExtendedPrismaClient } from './prisma.extension';

// Mock uuidv7 since we want to verify it's called, or at least check the format
jest.mock('uuidv7', () => ({
  uuidv7: jest.fn().mockReturnValue('mock-uuid-v7'),
}));

// Define types for the extension config to satisfy linter
type MiddlewareFn = (params: any) => Promise<any>;
interface ExtensionConfig {
  query: {
    $allModels: {
      create: MiddlewareFn;
      createMany: MiddlewareFn;
      delete: MiddlewareFn;
      deleteMany: MiddlewareFn;
      findUnique: MiddlewareFn;
      findFirst: MiddlewareFn;
      findMany: MiddlewareFn;
    };
  };
}

describe('PrismaExtension', () => {
  let mockPrisma: any;
  let extensionConfig: ExtensionConfig;

  beforeEach(() => {
    mockPrisma = {
      $extends: jest.fn((config: ExtensionConfig) => {
        extensionConfig = config;
        return 'extended-client';
      }),
    };
    createExtendedPrismaClient(mockPrisma as unknown as PrismaClient);
  });

  describe('UUID v7 Generation', () => {
    it('should generate ID for create if not present', async () => {
      const createMiddleware = extensionConfig.query.$allModels.create;
      const mockQuery = jest.fn();
      const args = { data: { name: 'test' } };

      await createMiddleware({ args, query: mockQuery });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((args.data as any).id).toBe('mock-uuid-v7');
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('should use provided ID for create if present', async () => {
      const createMiddleware = extensionConfig.query.$allModels.create;
      const mockQuery = jest.fn();
      const args = { data: { id: 'existing-id', name: 'test' } };

      await createMiddleware({ args, query: mockQuery });

      expect(args.data.id).toBe('existing-id');
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('should generate IDs for createMany if not present', async () => {
      const createManyMiddleware = extensionConfig.query.$allModels.createMany;
      const mockQuery = jest.fn();
      const args = { data: [{ name: 'test1' }, { name: 'test2' }] };

      await createManyMiddleware({ args, query: mockQuery });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((args.data as any)[0]).toHaveProperty('id', 'mock-uuid-v7');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((args.data as any)[1]).toHaveProperty('id', 'mock-uuid-v7');
      expect(mockQuery).toHaveBeenCalledWith(args);
    });
  });

  describe('Logical Delete', () => {
    // Models configured for soft delete in prisma.extension.ts
    const targetModel = 'Project';
    const nonTargetModel = 'SomeOtherModel';

    it('should transform delete to update for soft-delete models', async () => {
      const deleteMiddleware = extensionConfig.query.$allModels.delete;
      const mockQuery = jest.fn();
      const updateMock = jest.fn(); // Mocking model.update
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mockPrisma.Project = { update: updateMock };

      const args = { where: { id: '1' } };

      await deleteMiddleware({ model: targetModel, args, query: mockQuery });

      expect(updateMock).toHaveBeenCalledWith({
        ...args,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should call original query for non-soft-delete models on delete', async () => {
      const deleteMiddleware = extensionConfig.query.$allModels.delete;
      const mockQuery = jest.fn();
      const args = { where: { id: '1' } };

      await deleteMiddleware({ model: nonTargetModel, args, query: mockQuery });

      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('should transform deleteMany to updateMany for soft-delete models', async () => {
      const deleteManyMiddleware = extensionConfig.query.$allModels.deleteMany;
      const mockQuery = jest.fn();
      const updateManyMock = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mockPrisma.Project = { updateMany: updateManyMock };

      const args = { where: { active: true } };

      await deleteManyMiddleware({
        model: targetModel,
        args,
        query: mockQuery,
      });

      expect(updateManyMock).toHaveBeenCalledWith({
        ...args,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });
  });

  describe('Read Filtering (Logical Delete)', () => {
    const targetModel = 'Project';

    it('should filter out soft-deleted records on findMany', async () => {
      const findManyMiddleware = extensionConfig.query.$allModels.findMany;
      const mockQuery = jest.fn();
      const args = { where: { someField: 'value' } };

      await findManyMiddleware({ model: targetModel, args, query: mockQuery });

      expect(mockQuery).toHaveBeenCalledWith({
        ...args,

        where: { ...args.where, deletedAt: null },
      });
    });

    it('should filter out soft-deleted records on findFirst', async () => {
      const findFirstMiddleware = extensionConfig.query.$allModels.findFirst;
      const mockQuery = jest.fn();
      const args = { where: { someField: 'value' } };

      await findFirstMiddleware({ model: targetModel, args, query: mockQuery });

      expect(mockQuery).toHaveBeenCalledWith({
        ...args,

        where: { ...args.where, deletedAt: null },
      });
    });

    it('should return null if findUnique result is soft-deleted', async () => {
      const findUniqueMiddleware = extensionConfig.query.$allModels.findUnique;
      // Mock query returning a deleted record
      const mockQuery = jest
        .fn()
        .mockResolvedValue({ id: '1', deletedAt: new Date() });
      const args = { where: { id: '1' } };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await findUniqueMiddleware({
        model: targetModel,
        args,
        query: mockQuery,
      });

      expect(result).toBeNull();
    });

    it('should return result if findUnique result is NOT soft-deleted', async () => {
      const findUniqueMiddleware = extensionConfig.query.$allModels.findUnique;
      const mockRecord = { id: '1', deletedAt: null };
      const mockQuery = jest.fn().mockResolvedValue(mockRecord);
      const args = { where: { id: '1' } };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await findUniqueMiddleware({
        model: targetModel,
        args,
        query: mockQuery,
      });

      expect(result).toEqual(mockRecord);
    });
  });
});
