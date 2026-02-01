import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContributorInput,
  UpdateContributorInput,
} from './dto/contributor.input';

@Injectable()
export class ContributorService {
  constructor(private prisma: PrismaService) {}

  create(createContributorInput: CreateContributorInput) {
    return this.prisma.client.contributor.create({
      data: createContributorInput,
    });
  }

  findAll() {
    return this.prisma.client.contributor.findMany({
      where: { deletedAt: null },
    });
  }

  findOne(id: string) {
    return this.prisma.client.contributor.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, updateContributorInput: UpdateContributorInput) {
    return this.prisma.client.contributor.update({
      where: { id },
      data: updateContributorInput,
    });
  }

  remove(id: string) {
    return this.prisma.client.contributor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
