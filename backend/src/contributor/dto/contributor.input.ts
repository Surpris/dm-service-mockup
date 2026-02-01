import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContributorInput {
  @Field(() => String, { description: 'Contributor ID defined in plan' })
  contributorId: string;

  @Field(() => String)
  name: string;
}

@InputType()
export class UpdateContributorInput {
  @Field(() => String, { nullable: true })
  contributorId?: string;

  @Field(() => String, { nullable: true })
  name?: string;
}
