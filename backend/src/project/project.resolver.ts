import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.input';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    return this.projectService.create(createProjectInput);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectService.findAll();
  }

  @Query(() => Project, { name: 'project', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectService.update(id, updateProjectInput);
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => ID }) id: string) {
    return this.projectService.remove(id);
  }
}
