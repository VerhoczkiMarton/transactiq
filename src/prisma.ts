import { PrismaClient, Prisma } from '@prisma/client';

let PrismaEdge: typeof PrismaClient;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaEdge = require('@prisma/client/edge').PrismaClient;
} catch {
  PrismaEdge = PrismaClient;
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaOptions = {
  log:
    process.env.NODE_ENV === 'development'
      ? (['query', 'info', 'warn', 'error'] as Prisma.LogLevel[])
      : (['error'] as Prisma.LogLevel[]),
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

const isEdgeRuntime = () => {
  return process.env.NEXT_RUNTIME === 'edge';
};

function createPrismaClient() {
  if (isEdgeRuntime()) {
    return new PrismaEdge(prismaOptions);
  } else {
    if (process.env.NODE_ENV === 'development') {
      if (!global.prismaGlobal) {
        global.prismaGlobal = new PrismaClient(prismaOptions);
      }
      return global.prismaGlobal;
    }

    return new PrismaClient(prismaOptions);
  }
}

export const prisma = createPrismaClient();
