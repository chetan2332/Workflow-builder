import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';

@Module({
  imports: [HttpModule],
  controllers: [ExecutionController],
  providers: [ExecutionService],
  exports: [ExecutionService]
})
export class ExecutionModule {}
