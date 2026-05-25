import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { PrismaModule } from '@n8n-project/database';

@Module({
    imports: [PrismaModule],
  providers: [WorkflowsService],
  controllers: [WorkflowsController]
})
export class WorkflowsModule {}