import { InputType, Field } from '@nestjs/graphql';
import { EntityType } from '@prisma/client';

@InputType()
export class CreateUserDefinedRelationshipInput {
  @Field()
  relationshipType: string;

  @Field()
  sourceId: string;

  @Field(() => EntityType)
  sourceType: EntityType;

  @Field()
  targetId: string;

  @Field(() => EntityType)
  targetType: EntityType;

  @Field({ nullable: true })
  properties?: string; // Accepting JSON as string for simplicity in Input

  @Field()
  createdBy: string;
}

@InputType()
export class UpdateUserDefinedRelationshipInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  relationshipType?: string;

  @Field({ nullable: true })
  properties?: string;
}
