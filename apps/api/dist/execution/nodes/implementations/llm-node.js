"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmNode = void 0;
const code_node_1 = require("../categories/code-node");
class LlmNode extends code_node_1.CodeNode {
    async executeCode(input, ctx) {
        const config = ctx.config;
        const systemPrompt = config.systemPrompt;
        const userPrompt = config.userPrompt;
        ctx.tracker.log(`Calling ${config.provider} (${config.modelId})`, 'info');
        throw new Error('LLM node not yet implemented');
    }
}
exports.LlmNode = LlmNode;
//# sourceMappingURL=llm-node.js.map