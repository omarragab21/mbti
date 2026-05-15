import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_SQLITE_DATABASE_URL = 'file:./prisma/dev.db';

function getSqliteDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim() || DEFAULT_SQLITE_DATABASE_URL;

  if (databaseUrl === ':memory:' || databaseUrl.startsWith('file:')) {
    return databaseUrl;
  }

  throw new Error(
    'DATABASE_URL must be a SQLite file: URL for the current Prisma schema. Use PostgreSQL in production only after switching the Prisma provider and adapter.'
  );
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: getSqliteDatabaseUrl() });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
