import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProjectContributor } from '../../project/entities/project-contributor.entity';
import { Dataset } from '../../dataset/entities/dataset.entity';

@ObjectType()
export class Contributor {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Contributor ID defined in plan' })
  contributorId: string;

  @Field(() => String)
  name: string;

  @Field(() => [ProjectContributor], { nullable: true })
  projects?: ProjectContributor[];

  @Field(() => [Dataset], { nullable: true })
  managedDatasets?: Dataset[];

  @Field(() => [Dataset], { nullable: true })
  collectedDatasets?: Dataset[];

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
