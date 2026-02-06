import { Module } from '@nestjs/common';
import { UserDefinedRelationshipService } from './user-defined-relationship.service';
import { UserDefinedRelationshipResolver } from './user-defined-relationship.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserDefinedRelationshipResolver, UserDefinedRelationshipService],
  exports: [UserDefinedRelationshipService],
})
export class UserDefinedRelationshipModule {}
