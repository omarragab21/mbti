import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL?.trim() || 'file:./prisma/dev.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});
