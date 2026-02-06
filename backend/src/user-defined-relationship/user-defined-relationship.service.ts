import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDefinedRelationshipInput,
  UpdateUserDefinedRelationshipInput,
} from './dto/create-user-defined-relationship.input';

@Injectable()
export class UserDefinedRelationshipService {
  constructor(private prisma: PrismaService) {}

  create(input: CreateUserDefinedRelationshipInput) {
    return this.prisma.client.userDefinedRelationship.create({
      data: input,
    });
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
