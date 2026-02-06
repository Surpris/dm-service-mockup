import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserDefinedRelationshipService } from './user-defined-relationship.service';
import { UserDefinedRelationship } from './dto/user-defined-relationship.model';
import {
  CreateUserDefinedRelationshipInput,
  UpdateUserDefinedRelationshipInput,
} from './dto/create-user-defined-relationship.input';

@Resolver(() => UserDefinedRelationship)
export class UserDefinedRelationshipResolver {
  constructor(private readonly service: UserDefinedRelationshipService) {}

  @Mutation(() => UserDefinedRelationship)
  createUserDefinedRelationship(
    @Args('input') input: CreateUserDefinedRelationshipInput,
  ) {
    return this.service.create(input);
  }

  @Query(() => [UserDefinedRelationship])
  userDefinedRelationships() {
    return this.service.findAll();
  }

  @Query(() => UserDefinedRelationship)
  userDefinedRelationship(@Args('id') id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => UserDefinedRelationship)
  updateUserDefinedRelationship(
    @Args('input') input: UpdateUserDefinedRelationshipInput,
  ) {
    return this.service.update(input.id, input);
  }

  @Mutation(() => UserDefinedRelationship)
  removeUserDefinedRelationship(@Args('id') id: string) {
    return this.service.remove(id);
  }
}
