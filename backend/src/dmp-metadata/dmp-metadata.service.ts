import { Injectable } from '@nestjs/common';
import { CreateDMPMetadataInput } from './dto/create-dmp-metadata.input';
import { UpdateDMPMetadataInput } from './dto/update-dmp-metadata.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DMPMetadataService {
  constructor(private prisma: PrismaService) {}

  create(createDmpMetadataInput: CreateDMPMetadataInput) {
    return this.prisma.client.dMPMetadata.create({
      data: {
        createdDate: new Date(),
        lastUpdatedDate: new Date(),
        project: {
          connect: { id: createDmpMetadataInput.projectId },
        },
      },
      include: {
        project: true,
      },
    });
  }

  findAll() {
    return this.prisma.client.dMPMetadata.findMany();
  }

  findOne(id: string) {
    return this.prisma.client.dMPMetadata.findUnique({
      where: { id },
      include: { project: true },
    });
  }

  findByProjectId(projectId: string) {
    return this.prisma.client.dMPMetadata.findUnique({
      where: { projectId },
      include: { project: true },
    });
  }

  update(id: string, updateDmpMetadataInput: UpdateDMPMetadataInput) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...data } = updateDmpMetadataInput;
    return this.prisma.client.dMPMetadata.update({
      where: { id },
      data: {
        ...data,
        lastUpdatedDate: new Date(),
      },
      include: { project: true },
    });
  }

  remove(id: string) {
    return this.prisma.client.dMPMetadata.delete({
      where: { id },
    });
  }
}
