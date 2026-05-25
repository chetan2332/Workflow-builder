"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNode = void 0;
const code_node_1 = require("../categories/code-node");
class HttpNode extends code_node_1.CodeNode {
    async executeCode(input, ctx) {
        const config = ctx.config;
        const headersArray = config.headers ?? [];
        const userHeaders = Object.fromEntries(headersArray.filter(p => p.key.trim()).map(p => [p.key, p.value]));
        const headers = {
            'Content-Type': 'application/json',
            ...userHeaders,
        };
        ctx.tracker.log(`Making ${config.method} request to ${config.url}`, 'info');
        const response = await fetch(config.url, {
            method: config.method,
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
            signal: AbortSignal.timeout(config.timeout || 30000),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type') ?? '';
        const result = contentType.includes('application/json')
            ? await response.json()
            : await response.text();
        return result;
    }
}
exports.HttpNode = HttpNode;
//# sourceMappingURL=http-node.js.map