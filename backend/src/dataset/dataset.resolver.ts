import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DatasetService } from './dataset.service';
import { Dataset } from './entities/dataset.entity';
import { CreateDatasetInput, UpdateDatasetInput } from './dto/dataset.input';

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly datasetService: DatasetService) {}

  @Mutation(() => Dataset)
  createDataset(@Args('createDatasetInput') createDatasetInput: CreateDatasetInput) {
    return this.datasetService.create(createDatasetInput);
  }

  @Query(() => [Dataset], { name: 'datasets' })
  findAll() {
    return this.datasetService.findAll();
  }

  @Query(() => Dataset, { name: 'dataset', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.datasetService.findOne(id);
  }

  @Mutation(() => Dataset)
  updateDataset(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateDatasetInput') updateDatasetInput: UpdateDatasetInput,
  ) {
    return this.datasetService.update(id, updateDatasetInput);
  }

  @Mutation(() => Dataset)
  removeDataset(@Args('id', { type: () => ID }) id: string) {
    return this.datasetService.remove(id);
  }
}
