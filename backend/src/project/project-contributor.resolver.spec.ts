import { Test, TestingModule } from '@nestjs/testing';
import { ProjectContributorResolver } from './project-contributor.resolver';
import { ProjectService } from './project.service';
import { ContributorService } from '../contributor/contributor.service';
import { ProjectContributor } from './entities/project-contributor.entity';
import { Project } from './entities/project.entity';
import { Contributor } from '../contributor/entities/contributor.entity';

describe('ProjectContributorResolver', () => {
  let resolver: ProjectContributorResolver;

  const mockProjectService = {
    findOne: jest.fn(),
  };

  const mockContributorService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectContributorResolver,
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
        {
          provide: ContributorService,
          useValue: mockContributorService,
        },
      ],
    }).compile();

    resolver = module.get<ProjectContributorResolver>(
      ProjectContributorResolver,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('project', () => {
    it('should return the project directly if already present', async () => {
      const project = { id: 'project-1' } as Project;
      const projectContributor = { project } as ProjectContributor;

      const result = await resolver.project(projectContributor);

      expect(result).toBe(project);
      expect(mockProjectService.findOne).not.toHaveBeenCalled();
    });

    it('should call projectService.findOne if project is not present', async () => {
      const projectId = 'project-1';
      const projectContributor = { projectId } as ProjectContributor;
      const expectedProject = { id: projectId } as Project;
      mockProjectService.findOne.mockResolvedValue(expectedProject);

      const result = await resolver.project(projectContributor);

      expect(mockProjectService.findOne).toHaveBeenCalledWith(projectId);
      expect(result).toBe(expectedProject);
    });
  });

  describe('contributor', () => {
    it('should return the contributor directly if already present', async () => {
      const contributor = { id: 'contributor-1' } as Contributor;
      const projectContributor = { contributor } as ProjectContributor;

      const result = await resolver.contributor(projectContributor);

      expect(result).toBe(contributor);
      expect(mockContributorService.findOne).not.toHaveBeenCalled();
    });

    it('should call contributorService.findOne if contributor is not present', async () => {
      const contributorId = 'contributor-1';
      const projectContributor = { contributorId } as ProjectContributor;
      const expectedContributor = { id: contributorId } as Contributor;
      mockContributorService.findOne.mockResolvedValue(expectedContributor);

      const result = await resolver.contributor(projectContributor);

      expect(mockContributorService.findOne).toHaveBeenCalledWith(
        contributorId,
      );
      expect(result).toBe(expectedContributor);
    });
  });
});
