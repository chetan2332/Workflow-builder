import type { NodeExecutionMetadata, ExecutionLog, ExecutionWarning } from '@n8n-project/shared';
export declare class ResourceTracker {
    private startTime;
    private endTime;
    private logs;
    private warnings;
    private apiCallCount;
    private startMemory;
    private memorySnapshots;
    constructor();
    start(): this;
    stop(data: {
        itemsProcessed: number;
        itemsOutput: number;
    }): NodeExecutionMetadata;
    log(message: string, level?: 'info' | 'debug' | 'error', context?: Record<string, unknown>): void;
    warn(code: string, message: string, field?: string): void;
    trackApiCall(): void;
    getLogs(): ExecutionLog[];
    getWarnings(): ExecutionWarning[];
    snapshotMemory(): void;
}
