import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
    imports: [PrismaModule, TemplatesModule],
  providers: [WorkflowsService],
  controllers: [WorkflowsController]
})
export class WorkflowsModule {}
