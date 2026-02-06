import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatasetInput, UpdateDatasetInput } from './dto/dataset.input';

@Injectable()
export class DatasetService {
  constructor(private prisma: PrismaService) {}

  create(createDatasetInput: CreateDatasetInput) {
    return this.prisma.client.dataset.create({
      data: createDatasetInput,
    });
  }

  findAll() {
    return this.prisma.client.dataset.findMany({
      where: { deletedAt: null },
    });
  }

  findOne(id: string) {
    return this.prisma.client.dataset.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, updateDatasetInput: UpdateDatasetInput) {
    return this.prisma.client.dataset.update({
      where: { id },
      data: updateDatasetInput,
    });
  }

  remove(id: string) {
    return this.prisma.client.dataset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findProject(id: string) {
    return this.prisma.client.project.findUnique({ where: { id } });
  }

  findContributor(id: string) {
    return this.prisma.client.contributor.findUnique({ where: { id } });
  }
}
