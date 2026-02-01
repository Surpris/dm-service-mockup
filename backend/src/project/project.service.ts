import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.input';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectInput: CreateProjectInput) {
    return this.prisma.client.project.create({
      data: createProjectInput,
    });
  }

  findAll() {
    return this.prisma.client.project.findMany({
      where: { deletedAt: null },
    });
  }

  findOne(id: string) {
    return this.prisma.client.project.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, updateProjectInput: UpdateProjectInput) {
    return this.prisma.client.project.update({
      where: { id },
      data: updateProjectInput,
    });
  }

  remove(id: string) {
    return this.prisma.client.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
