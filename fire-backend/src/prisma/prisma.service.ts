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
    const pool = new Pool({
      host: '127.0.0.1',
      port: 5433,
      database: 'fire_db',
      user: 'postgres',
      password: 'postgres',
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
    this.logger.log('Database pool configured for 127.0.0.1:5433/fire_db');
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
