import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5433/fire_db');
    const pool = new Pool({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port, 10) || 5432,
      database: dbUrl.pathname.replace('/', ''),
      user: dbUrl.username || undefined,
      password: dbUrl.password || undefined,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
    this.logger.log(`Database pool configured for ${dbUrl.hostname}:${dbUrl.port}/${dbUrl.pathname.replace('/', '')}`);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
