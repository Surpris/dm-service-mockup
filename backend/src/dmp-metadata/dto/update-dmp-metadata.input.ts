import { CreateDMPMetadataInput } from './create-dmp-metadata.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateDMPMetadataInput extends PartialType(
  CreateDMPMetadataInput,
) {
  @Field(() => ID)
  id: string;
}
