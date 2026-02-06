import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { EntityType } from '@prisma/client';

registerEnumType(EntityType, {
  name: 'EntityType',
});

@ObjectType()
export class UserDefinedRelationship {
  @Field(() => ID)
  id: string;

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
  properties?: string; // Returning JSON as string for simplicity, or we can use generic Scalar

  @Field()
  createdAt: Date;

  @Field()
  createdBy: string;
}
