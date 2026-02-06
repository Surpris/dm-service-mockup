import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Project } from '../../project/entities/project.entity';

@ObjectType()
export class DMPMetadata {
  @Field(() => ID)
  id: string;

  @Field()
  createdDate: Date;

  @Field()
  lastUpdatedDate: Date;

  @Field(() => String)
  projectId: string;

  @Field(() => Project, { nullable: true })
  project?: Project;
}
