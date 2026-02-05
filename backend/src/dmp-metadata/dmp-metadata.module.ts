import { Module } from '@nestjs/common';
import { DMPMetadataService } from './dmp-metadata.service';
import { DMPMetadataResolver } from './dmp-metadata.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DMPMetadataResolver, DMPMetadataService],
  exports: [DMPMetadataService],
})
export class DMPMetadataModule {}
