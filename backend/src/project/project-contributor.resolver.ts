import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProjectContributor } from './entities/project-contributor.entity';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { Contributor } from '../contributor/entities/contributor.entity';
import { ContributorService } from '../contributor/contributor.service';

@Resolver(() => ProjectContributor)
export class ProjectContributorResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly contributorService: ContributorService,
  ) {}

  @ResolveField(() => Project)
  async project(@Parent() projectContributor: ProjectContributor) {
    if (projectContributor.project) return projectContributor.project;
    return this.projectService.findOne(projectContributor.projectId);
  }

  @ResolveField(() => Contributor)
  async contributor(@Parent() projectContributor: ProjectContributor) {
    if (projectContributor.contributor) return projectContributor.contributor;
    return this.contributorService.findOne(projectContributor.contributorId);
  }
}
