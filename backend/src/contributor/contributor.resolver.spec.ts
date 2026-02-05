import { Test, TestingModule } from '@nestjs/testing';
import { ContributorResolver } from './contributor.resolver';
import { ContributorService } from './contributor.service';
import {
  CreateContributorInput,
  UpdateContributorInput,
} from './dto/contributor.input';

describe('ContributorResolver', () => {
  let resolver: ContributorResolver;
  // let service: ContributorService;

  const mockContributorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributorResolver,
        {
          provide: ContributorService,
          useValue: mockContributorService,
        },
      ],
    }).compile();

    resolver = module.get<ContributorResolver>(ContributorResolver);
    // service = module.get<ContributorService>(ContributorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createContributor', () => {
    it('should call service.create with correct data', async () => {
      const input: CreateContributorInput = {
        name: 'New Contributor',
        email: 'test@example.com',
      };
      const expectedResult = { id: 'uuid', ...input };
      mockContributorService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createContributor(input);

      expect(mockContributorService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('contributors', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Contributor 1' }];
      mockContributorService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.findAll();

      expect(mockContributorService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('contributor', () => {
    it('should call service.findOne with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'Contributor 1' };
      mockContributorService.findOne.mockResolvedValue(expectedResult);

      const result = await resolver.findOne(id);

      expect(mockContributorService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateContributor', () => {
    it('should call service.update with id and input', async () => {
      const id = 'uuid-1';
      const input: UpdateContributorInput = { id, name: 'Updated' };
      const expectedResult = { id, name: 'Updated' };
      mockContributorService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateContributor(id, input);

      expect(mockContributorService.update).toHaveBeenCalledWith(id, input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('removeContributor', () => {
    it('should call service.remove with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockContributorService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.removeContributor(id);

      expect(mockContributorService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });
});
