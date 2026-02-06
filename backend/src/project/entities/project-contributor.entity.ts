import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ProjectRole } from '@prisma/client';
import { Project } from './project.entity';
import { Contributor } from '../../contributor/entities/contributor.entity';

registerEnumType(ProjectRole, {
  name: 'ProjectRole',
  description: 'Role of a contributor in a project',
});

@ObjectType()
export class ProjectContributor {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  projectId: string;

  @Field(() => Project, { nullable: true })
  project?: Project;

  @Field(() => String)
  contributorId: string;

  @Field(() => Contributor, { nullable: true })
  contributor?: Contributor;

  @Field(() => ProjectRole)
  role: ProjectRole;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
