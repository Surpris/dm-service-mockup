import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DMPMetadata } from '../../dmp-metadata/entities/dmp-metadata.entity';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Research Project Number' })
  projectNumber: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => DMPMetadata, { nullable: true })
  metadata?: DMPMetadata;
}
