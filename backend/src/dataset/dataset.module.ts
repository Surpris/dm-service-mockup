import { Module } from '@nestjs/common';
import { DatasetService } from './dataset.service';
import { DatasetResolver } from './dataset.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DatasetResolver, DatasetService],
})
export class DatasetModule {}
