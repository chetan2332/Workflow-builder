"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionNode = void 0;
const code_node_1 = require("../categories/code-node");
class FunctionNode extends code_node_1.CodeNode {
    async executeCode(input, ctx) {
        const config = ctx.config;
        ctx.tracker.log('Executing user function', 'info');
        const userFunction = this.createSandboxedFunction(config.code);
        const result = await userFunction(input);
        return result;
    }
    createSandboxedFunction(code) {
        try {
            const fn = new Function('input', code);
            return fn;
        }
        catch (error) {
            throw new Error(`Function compilation failed: ${error.message}`);
        }
    }
}
exports.FunctionNode = FunctionNode;
//# sourceMappingURL=function-node.js.map