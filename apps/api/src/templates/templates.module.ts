import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      ttl: 3600000, // 1 hour
      max: 100,
    }),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
