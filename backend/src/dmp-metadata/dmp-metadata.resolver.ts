import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DMPMetadataService } from './dmp-metadata.service';
import { DMPMetadata } from './entities/dmp-metadata.entity';
import { CreateDMPMetadataInput } from './dto/create-dmp-metadata.input';
import { UpdateDMPMetadataInput } from './dto/update-dmp-metadata.input';

@Resolver(() => DMPMetadata)
export class DMPMetadataResolver {
  constructor(private readonly dmpMetadataService: DMPMetadataService) {}

  @Mutation(() => DMPMetadata)
  createDMPMetadata(
    @Args('createDmpMetadataInput')
    createDmpMetadataInput: CreateDMPMetadataInput,
  ) {
    return this.dmpMetadataService.create(createDmpMetadataInput);
  }

  @Query(() => [DMPMetadata], { name: 'allDmpMetadata' })
  findAll() {
    return this.dmpMetadataService.findAll();
  }

  @Query(() => DMPMetadata, { name: 'dmpMetadata' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.dmpMetadataService.findOne(id);
  }

  @Query(() => DMPMetadata, { name: 'dmpMetadataByProject' })
  findByProject(@Args('projectId', { type: () => String }) projectId: string) {
    return this.dmpMetadataService.findByProjectId(projectId);
  }

  @Mutation(() => DMPMetadata)
  updateDMPMetadata(
    @Args('updateDmpMetadataInput')
    updateDmpMetadataInput: UpdateDMPMetadataInput,
  ) {
    return this.dmpMetadataService.update(
      updateDmpMetadataInput.id,
      updateDmpMetadataInput,
    );
  }

  @Mutation(() => DMPMetadata)
  removeDMPMetadata(@Args('id', { type: () => String }) id: string) {
    return this.dmpMetadataService.remove(id);
  }
}
