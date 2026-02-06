import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphResolver } from './graph.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GraphResolver, GraphService],
  exports: [GraphService],
})
export class GraphModule {}
