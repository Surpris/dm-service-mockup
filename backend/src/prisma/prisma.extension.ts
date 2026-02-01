import { Prisma, PrismaClient } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';

export const softDeleteModels = ['Project', 'Contributor', 'Dataset', 'UserDefinedRelationship'];

export type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

export function createExtendedPrismaClient(prisma: PrismaClient) {
  return prisma.$extends({
    name: 'uuid-v7-and-soft-delete',
    query: {
      $allModels: {
        async create({ model, args, query }) {
          if (args.data && typeof args.data === 'object') {
            if (!('id' in args.data) || !args.data.id) {
              (args.data as any).id = uuidv7();
            }
          }
          return query(args);
        },
        async createMany({ model, args, query }) {
          if (Array.isArray(args.data)) {
            args.data.forEach((item: any) => {
              if (!item.id) {
                item.id = uuidv7();
              }
            });
          }
          return query(args);
        },
        async delete({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            return (prisma as any)[model].update({
              ...args,
              data: { deletedAt: new Date() },
            });
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            return (prisma as any)[model].updateMany({
              ...args,
              data: { deletedAt: new Date() },
            });
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            // findUnique requires unique criteria, we can't easily inject deletedAt: null into where
            // unless we change it to findFirst (which we can't easily do in 'query' extension while keeping types happy easily?)
            // Actually, we can just run the query and filter the result.
            const result = await query(args);
            if (result && (result as any).deletedAt) {
              return null;
            }
            return result;
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async findMany({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
      },
    },
  });
}
