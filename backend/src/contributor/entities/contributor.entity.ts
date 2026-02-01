import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Contributor {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Contributor ID defined in plan' })
  contributorId: string;

  @Field(() => String)
  name: string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
