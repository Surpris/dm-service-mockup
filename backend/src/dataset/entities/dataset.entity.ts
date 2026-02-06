import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { AccessPolicy } from '@prisma/client';
import { Project } from '../../project/entities/project.entity';
import { Contributor } from '../../contributor/entities/contributor.entity';

registerEnumType(AccessPolicy, {
  name: 'AccessPolicy',
  description: 'Access policy for the dataset',
});

@ObjectType()
export class Dataset {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  datasetNo: number;

  @Field(() => String)
  title: string;

  @Field(() => AccessPolicy)
  accessPolicy: AccessPolicy;

  @Field(() => String)
  projectId: string;

  @Field(() => String)
  collectedById: string;

  @Field(() => String, { nullable: true })
  managedById?: string;

  @Field(() => Project)
  project: Project;

  @Field(() => Contributor)
  collectedBy: Contributor;

  @Field(() => Contributor, { nullable: true })
  managedBy?: Contributor;

  @Field(() => Date, { nullable: true })
  collectedAt?: Date;

  @Field(() => Date, { nullable: true })
  managedFrom?: Date;

  @Field(() => Date, { nullable: true })
  managedTo?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
