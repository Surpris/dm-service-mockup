import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ContributorService } from './contributor.service';
import { Contributor } from './entities/contributor.entity';
import { ProjectContributor } from '../project/entities/project-contributor.entity';
import { Dataset } from '../dataset/entities/dataset.entity';
import {
  CreateContributorInput,
  UpdateContributorInput,
} from './dto/contributor.input';

@Resolver(() => Contributor)
export class ContributorResolver {
  constructor(private readonly contributorService: ContributorService) {}

  @Mutation(() => Contributor)
  createContributor(
    @Args('createContributorInput')
    createContributorInput: CreateContributorInput,
  ) {
    return this.contributorService.create(createContributorInput);
  }

  @Query(() => [Contributor], { name: 'contributors' })
  findAll() {
    return this.contributorService.findAll();
  }

  @Query(() => Contributor, { name: 'contributor', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.contributorService.findOne(id);
  }

  @Mutation(() => Contributor)
  updateContributor(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateContributorInput')
    updateContributorInput: UpdateContributorInput,
  ) {
    return this.contributorService.update(id, updateContributorInput);
  }

  @Mutation(() => Contributor)
  removeContributor(@Args('id', { type: () => ID }) id: string) {
    return this.contributorService.remove(id);
  }

  @ResolveField(() => [ProjectContributor])
  projects(@Parent() contributor: Contributor) {
    return this.contributorService.findProjects(contributor.id);
  }

  @ResolveField(() => [Dataset])
  managedDatasets(@Parent() contributor: Contributor) {
    return this.contributorService.findManagedDatasets(contributor.id);
  }

  @ResolveField(() => [Dataset])
  collectedDatasets(@Parent() contributor: Contributor) {
    return this.contributorService.findCollectedDatasets(contributor.id);
  }
}
