import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: string, updateProjectInput: UpdateProjectInput) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found or has been deleted`,
      );
    }
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

  findDatasets(projectId: string) {
    return this.prisma.client.dataset.findMany({
      where: { projectId, deletedAt: null },
    });
  }

  findContributors(projectId: string) {
    return this.prisma.client.projectContributor.findMany({
      where: { projectId, deletedAt: null },
      include: { contributor: true },
    });
  }
}
