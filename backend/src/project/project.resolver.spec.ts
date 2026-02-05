import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.input';

describe('ProjectResolver', () => {
  let resolver: ProjectResolver;
  // let service: ProjectService;

  const mockProjectService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectResolver,
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    resolver = module.get<ProjectResolver>(ProjectResolver);
    // service = module.get<ProjectService>(ProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createProject', () => {
    it('should call service.create with correct data', async () => {
      const input: CreateProjectInput = { name: 'New Project' };
      const expectedResult = { id: 'uuid', ...input };
      mockProjectService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createProject(input);

      expect(mockProjectService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('projects', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Project 1' }];
      mockProjectService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.findAll();

      expect(mockProjectService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('project', () => {
    it('should call service.findOne with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'Project 1' };
      mockProjectService.findOne.mockResolvedValue(expectedResult);

      const result = await resolver.findOne(id);

      expect(mockProjectService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateProject', () => {
    it('should call service.update with id and input', async () => {
      const id = 'uuid-1';
      const input: UpdateProjectInput = { id, name: 'Updated' };
      const expectedResult = { id, name: 'Updated' };
      mockProjectService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateProject(id, input);

      expect(mockProjectService.update).toHaveBeenCalledWith(id, input);
      expect(result).toBe(expectedResult);
    });
  });

  describe('removeProject', () => {
    it('should call service.remove with id', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, deletedAt: new Date() };
      mockProjectService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.removeProject(id);

      expect(mockProjectService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });
});
