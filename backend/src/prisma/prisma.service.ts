import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  createExtendedPrismaClient,
  ExtendedPrismaClient,
} from './prisma.extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _baseClient: PrismaClient;
  private _extendedClient: ExtendedPrismaClient;

  constructor() {
    this._baseClient = new PrismaClient();
    this._extendedClient = createExtendedPrismaClient(this._baseClient);
  }

  get client() {
    return this._extendedClient;
  }

  async onModuleInit() {
    await this._baseClient.$connect();
  }

  async onModuleDestroy() {
    await this._baseClient.$disconnect();
  }
}
