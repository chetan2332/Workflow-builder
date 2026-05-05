export interface ExecutionLog {
    timestamp: number;
    level: 'info' | 'debug' | 'error';
    message: string;
    context?: Record<string, unknown>;
}
export interface ExecutionWarning {
    timestamp: number;
    code: string;
    message: string;
    field?: string;
}
export interface NodeExecutionMetadata {
    startTime: number;
    endTime: number;
    durationMs: number;
    itemsProcessed: number;
    itemsOutput: number;
    memoryUsedMb: number;
    apiCallsMade: number;
    logs: ExecutionLog[];
    warnings: ExecutionWarning[];
}
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
