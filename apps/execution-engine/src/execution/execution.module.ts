import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';

/**
 * Execution Module
 *
 * Provides:
 * - GET /api/execution/nodes - Returns all node definitions
 * - POST /api/execution/node/:nodeId - Executes a node
 */
@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
  exports: [ExecutionService]  // Export service for use in other modules (e.g., workflow execution)
})
export class ExecutionModule {}
