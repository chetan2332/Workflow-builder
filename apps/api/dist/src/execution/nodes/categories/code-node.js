"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeNode = void 0;
const base_node_1 = require("../base/base-node");
const shared_1 = require("@n8n-project/shared");
class CodeNode extends base_node_1.BaseNode {
    async execute(ctx) {
        const startTime = Date.now();
        ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');
        const inputHandle = ctx.definition.inputHandles[0];
        const successHandle = ctx.definition.outputHandles[0];
        const errorHandle = ctx.definition.outputHandles[1];
        this.validateInputHandles(ctx);
        const inputs = this.inputs[inputHandle.id];
        if (!inputs || inputs.length === 0) {
            throw new Error('No input data received');
        }
        const successResults = [];
        const errorResults = [];
        for (const input of inputs) {
            try {
                if (input === undefined) {
                    throw new Error('Input data is undefined');
                }
                if (inputHandle.schema) {
                    ctx.tracker.log('Validating input data', 'info');
                    const validation = (0, shared_1.validateData)(input, inputHandle.schema);
                    if (!validation.valid) {
                        throw new Error(`Input validation failed: ${JSON.stringify(validation.errors)}`);
                    }
                }
                const interpolatedConfig = this.interpolateConfig(ctx.config, input, ctx.definition);
                this.validateConditionalFields(interpolatedConfig, ctx.definition);
                ctx.tracker.log('Executing node logic...', 'info');
                const result = await this.executeCode(input, {
                    ...ctx,
                    config: interpolatedConfig
                });
                if (successHandle.schema) {
                    ctx.tracker.log('Validating output data', 'info');
                    const validation = (0, shared_1.validateData)(result, successHandle.schema);
                    if (!validation.valid) {
                        throw new Error(`Output validation failed: ${JSON.stringify(validation.errors)}`);
                    }
                }
                successResults.push(result);
            }
            catch (error) {
                ctx.tracker.log(`Failed to process input: ${error.message}`, 'error');
                errorResults.push({
                    error: true,
                    message: error.message,
                    code: error.code || 'EXECUTION_ERROR',
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                    input: input
                });
            }
        }
        ctx.tracker.log(`${ctx.definition.label} completed: ${successResults.length} succeeded, ${errorResults.length} failed`, 'info');
        return {
            outputs: {
                [successHandle.id]: successResults,
                [errorHandle.id]: errorResults
            },
            metadata: {
                duration: Date.now() - startTime,
                itemsProcessed: inputs.length
            }
        };
    }
    validateConditionalFields(config, definition) {
        const allFields = this.extractFieldsFromDefinition(definition);
        for (const field of allFields) {
            const shouldShow = this.shouldShowField(field, config);
            if (!shouldShow && field.required && field.id in config) {
                throw new Error(`Field '${field.label}' should not be present when condition '${field.showWhen}' is false`);
            }
        }
    }
    interpolate(template, input) {
        if (typeof template !== 'string') {
            return template;
        }
        return template.replace(/\{\{input\.(\w+)\}\}/g, (match, key) => {
            const value = input[key];
            return value !== undefined ? String(value) : match;
        });
    }
    interpolateObject(obj, input) {
        if (!obj)
            return {};
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = this.interpolate(value, input);
        }
        return result;
    }
}
exports.CodeNode = CodeNode;
//# sourceMappingURL=code-node.js.map