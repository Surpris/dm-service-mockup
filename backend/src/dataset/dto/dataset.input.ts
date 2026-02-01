import { InputType, Field, Int } from '@nestjs/graphql';
import { AccessPolicy } from '@prisma/client';

@InputType()
export class CreateDatasetInput {
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

  @Field(() => Date, { nullable: true })
  collectedAt?: Date;
}

@InputType()
export class UpdateDatasetInput {
  @Field(() => Int, { nullable: true })
  datasetNo?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => AccessPolicy, { nullable: true })
  accessPolicy?: AccessPolicy;
  
  // Relations update typically might need separate handling or just ID updates
  @Field(() => String, { nullable: true })
  collectedById?: string;

  @Field(() => String, { nullable: true })
  managedById?: string;
  
  @Field(() => Date, { nullable: true })
  collectedAt?: Date;

  @Field(() => Date, { nullable: true })
  managedFrom?: Date;

  @Field(() => Date, { nullable: true })
  managedTo?: Date;
}
