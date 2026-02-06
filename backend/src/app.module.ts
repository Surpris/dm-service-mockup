import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { DatasetModule } from './dataset/dataset.module';
import { ContributorModule } from './contributor/contributor.module';
import { DMPMetadataModule } from './dmp-metadata/dmp-metadata.module';
import { UserDefinedRelationshipModule } from './user-defined-relationship/user-defined-relationship.module';
import { GraphModule } from './graph/graph.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    ProjectModule,
    DatasetModule,
    ContributorModule,
    DMPMetadataModule,
    UserDefinedRelationshipModule,
    GraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
