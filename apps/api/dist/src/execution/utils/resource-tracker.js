"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceTracker = void 0;
class ResourceTracker {
    startTime;
    endTime;
    logs = [];
    warnings = [];
    apiCallCount = 0;
    startMemory;
    memorySnapshots = [];
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.startMemory = 0;
    }
    start() {
        this.startTime = Date.now();
        this.startMemory = process.memoryUsage().heapUsed;
        return this;
    }
    stop(data) {
        this.endTime = Date.now();
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
    log(message, level = 'info', context) {
        this.logs.push({
            timestamp: Date.now(),
            level,
            message,
            context,
        });
    }
    warn(code, message, field) {
        this.warnings.push({
            timestamp: Date.now(),
            code,
            message,
            field,
        });
    }
    trackApiCall() {
        this.apiCallCount++;
    }
    getLogs() {
        return this.logs;
    }
    getWarnings() {
        return this.warnings;
    }
    snapshotMemory() {
        this.memorySnapshots.push(process.memoryUsage().heapUsed);
    }
}
exports.ResourceTracker = ResourceTracker;
//# sourceMappingURL=resource-tracker.js.map