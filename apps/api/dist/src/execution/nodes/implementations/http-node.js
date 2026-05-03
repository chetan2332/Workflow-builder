"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNode = void 0;
const code_node_1 = require("../categories/code-node");
class HttpNode extends code_node_1.CodeNode {
    async executeCode(input, ctx) {
        const config = ctx.config;
        const url = config.url;
        const headers = config.headers || {};
        const body = config.body;
        ctx.tracker.log(`Making ${config.method} request to ${url}`, 'info');
        const response = await fetch(url, {
            method: config.method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(config.timeout || 30000)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        let result = await response.json();
        if (config.outputParser) {
            result = this.parseOutput(result, config.outputParser);
        }
        return result;
    }
    parseOutput(data, parser) {
        try {
            const fn = new Function('res', `return ${parser};`);
            return fn(data);
        }
        catch (error) {
            throw new Error(`Output parser failed: ${error.message}`);
        }
    }
}
exports.HttpNode = HttpNode;
//# sourceMappingURL=http-node.js.map