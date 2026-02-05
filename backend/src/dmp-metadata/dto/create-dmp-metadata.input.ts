import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDMPMetadataInput {
  @Field()
  projectId: string;

  // createdDate and lastUpdatedDate will be handled by the server
}
