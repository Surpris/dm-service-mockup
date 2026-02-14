import { Test, TestingModule } from '@nestjs/testing';
import { DMPMetadataResolver } from './dmp-metadata.resolver';
import { DMPMetadataService } from './dmp-metadata.service';
import { CreateDMPMetadataInput } from './dto/create-dmp-metadata.input';
import { UpdateDMPMetadataInput } from './dto/update-dmp-metadata.input';

describe('DMPMetadataResolver', () => {
  let resolver: DMPMetadataResolver;
  let module: TestingModule;

  const mockDMPMetadataService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByProjectId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DMPMetadataResolver,
        {
          provide: DMPMetadataService,
          useValue: mockDMPMetadataService,
        },
      ],
    }).compile();

    resolver = module.get<DMPMetadataResolver>(DMPMetadataResolver);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createDMPMetadata', () => {
    it('should call service.create', async () => {
      const input: CreateDMPMetadataInput = { projectId: 'proj-1' };
      const expectedResult = { id: 'dmp-1', ...input };
      mockDMPMetadataService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createDMPMetadata(input);

      expect(mockDMPMetadataService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: 'dmp-1' }];
      mockDMPMetadataService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.findAll();

      expect(mockDMPMetadataService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      const id = 'dmp-1';
      const expectedResult = { id };
      mockDMPMetadataService.findOne.mockResolvedValue(expectedResult);

      const result = await resolver.findOne(id);

      expect(mockDMPMetadataService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findByProject', () => {
    it('should call service.findByProjectId', async () => {
      const projectId = 'proj-1';
      const expectedResult = { id: 'dmp-1', projectId };
      mockDMPMetadataService.findByProjectId.mockResolvedValue(expectedResult);

      const result = await resolver.findByProject(projectId);

      expect(mockDMPMetadataService.findByProjectId).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateDMPMetadata', () => {
    it('should call service.update', async () => {
      const input: UpdateDMPMetadataInput = {
        id: 'dmp-1',
        status: 'PUBLISHED',
      };
      const expectedResult = { id: 'dmp-1', status: 'PUBLISHED' };
      mockDMPMetadataService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateDMPMetadata(input);

      expect(mockDMPMetadataService.update).toHaveBeenCalledWith(
        input.id,
        input,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('removeDMPMetadata', () => {
    it('should call service.remove', async () => {
      const id = 'dmp-1';
      const expectedResult = { id };
      mockDMPMetadataService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.removeDMPMetadata(id);

      expect(mockDMPMetadataService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });
});
