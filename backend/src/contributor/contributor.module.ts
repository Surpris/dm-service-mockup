import { Module } from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { ContributorResolver } from './contributor.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContributorResolver, ContributorService],
  exports: [ContributorService],
})
export class ContributorModule {}
