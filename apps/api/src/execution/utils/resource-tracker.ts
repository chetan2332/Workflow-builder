import type {
  NodeExecutionMetadata,
  ExecutionLog,
  ExecutionWarning,
} from '@n8n-project/shared';

export class ResourceTracker {
  private startTime: number;
  private endTime: number;
  private logs: ExecutionLog[] = [];
  private warnings: ExecutionWarning[] = [];
  private apiCallCount: number = 0;
  private startMemory: number;
  private memorySnapshots: number[] = [];
  
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.startMemory = 0;
  }

  start(): this {
    this.startTime = Date.now();
    // Take memory snapshot at start of THIS execution only
    this.startMemory = process.memoryUsage().heapUsed;
    return this;
  }

  stop(data: {
    itemsProcessed: number;
    itemsOutput: number;
  }): NodeExecutionMetadata {
    this.endTime = Date.now();

    // Memory delta for THIS execution
    const endMemory = process.memoryUsage().heapUsed;
    const memoryDelta = endMemory - this.startMemory;

    return {
      startTime: this.startTime,
      endTime: this.endTime,
      durationMs: this.endTime - this.startTime,
      itemsProcessed: data.itemsProcessed,
      itemsOutput: data.itemsOutput,
      memoryUsedMb: memoryDelta / 1024 / 1024,
      apiCallsMade: this.apiCallCount,
      logs: this.logs,
      warnings: this.warnings,
    };
  }

  log(
    message: string,
    level: 'info' | 'debug' | 'error' = 'info',
    context?: Record<string, unknown>,
  ): void {
    this.logs.push({
      timestamp: Date.now(),
      level,
      message,
      context,
    });
  }

  warn(code: string, message: string, field?: string): void {
    this.warnings.push({
      timestamp: Date.now(),
      code,
      message,
      field,
    });
  }

  trackApiCall(): void {
    this.apiCallCount++;
  }

  getLogs(): ExecutionLog[] {
    return this.logs;
  }

  getWarnings(): ExecutionWarning[] {
    return this.warnings;
  }

  /**
   * Take periodic memory snapshots during execution
   * Useful for long-running nodes
   */
  snapshotMemory(): void {
    this.memorySnapshots.push(process.memoryUsage().heapUsed);
  }
}
