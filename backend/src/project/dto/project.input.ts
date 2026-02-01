import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String, { description: 'Research Project Number' })
  projectNumber: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field(() => String, { nullable: true })
  projectNumber?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
