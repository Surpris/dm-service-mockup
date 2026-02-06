import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { ProjectContributorResolver } from './project-contributor.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ContributorModule } from '../contributor/contributor.module';

@Module({
  imports: [PrismaModule, ContributorModule],
  providers: [ProjectResolver, ProjectContributorResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
