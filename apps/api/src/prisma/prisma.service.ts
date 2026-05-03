import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    // Create connection pool
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections
      min: 5,  // Minimum connections
      idleTimeoutMillis: 30000, // 30 seconds
      connectionTimeoutMillis: 5000, // 5 seconds
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}