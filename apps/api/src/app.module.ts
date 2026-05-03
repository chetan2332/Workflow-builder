import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { TemplatesModule } from './templates/templates.module';
import { ExecutionModule } from './execution/execution.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TemplatesModule,
    WorkflowsModule,
    ExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
