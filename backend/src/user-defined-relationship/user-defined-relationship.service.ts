import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDefinedRelationshipInput,
  UpdateUserDefinedRelationshipInput,
} from './dto/create-user-defined-relationship.input';

@Injectable()
export class UserDefinedRelationshipService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateUserDefinedRelationshipInput) {
    // Validate source existence
    await this.validateEntityExistence(input.sourceId, input.sourceType);
    // Validate target existence
    await this.validateEntityExistence(input.targetId, input.targetType);

    return this.prisma.client.userDefinedRelationship.create({
      data: input,
    });
  }

  private async validateEntityExistence(id: string, type: string) {
    let exists = false;
    switch (type) {
      case 'PROJECT':
        exists = !!(await this.prisma.client.project.findFirst({
          where: { id, deletedAt: null },
        }));
        break;
      case 'DATASET':
        exists = !!(await this.prisma.client.dataset.findFirst({
          where: { id, deletedAt: null },
        }));
        break;
      case 'CONTRIBUTOR':
        exists = !!(await this.prisma.client.contributor.findFirst({
          where: { id, deletedAt: null },
        }));
        break;
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }

    if (!exists) {
      throw new NotFoundException(`${type} with ID ${id} not found or has been deleted`);
    }
  }

  findAll() {
    return this.prisma.client.userDefinedRelationship.findMany({
      where: { deletedAt: null },
    });
  }

  findOne(id: string) {
    return this.prisma.client.userDefinedRelationship.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, updateInput: UpdateUserDefinedRelationshipInput) {
    const { id: _unused, ...data } = updateInput;
    return this.prisma.client.userDefinedRelationship.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.client.userDefinedRelationship.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
