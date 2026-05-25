"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNode = void 0;
class BaseNode {
    id;
    definition;
    config;
    inputs;
    constructor(id, definition, config, inputs) {
        this.id = id;
        this.definition = definition;
        this.config = config;
        this.inputs = inputs;
    }
    validateInputHandles(ctx) {
        const { definition, inputs } = ctx;
        for (const handleDef of definition.inputHandles) {
            if (!(handleDef.id in inputs)) {
                throw new Error(`Missing required input handle: ${handleDef.id}`);
            }
        }
        if (!definition.dynamicHandles?.inputs) {
            for (const handleId of Object.keys(inputs)) {
                const isDefined = definition.inputHandles.some(h => h.id === handleId);
                if (!isDefined) {
                    throw new Error(`Unexpected input handle: ${handleId}`);
                }
            }
        }
    }
    interpolateConfig(config, input, definition) {
        const interpolated = { ...config };
        const allFields = this.extractFieldsFromDefinition(definition);
        for (const field of allFields) {
            if (field.supportsInterpolation && field.id in interpolated) {
                interpolated[field.id] = this.interpolateValue(interpolated[field.id], input);
            }
        }
        return interpolated;
    }
    shouldShowField(field, config) {
        if (!field.showWhen)
            return true;
        try {
            const fn = new Function('config', `return (${field.showWhen});`);
            return fn(config) === true;
        }
        catch (error) {
            return true;
        }
    }
    extractFieldsFromDefinition(definition) {
        return definition.config.fields;
    }
    interpolateValue(value, input) {
        if (typeof value !== 'string')
            return value;
        return value.replace(/\{\{input\.(\w+)\}\}/g, (match, key) => {
            const val = input[key];
            return val !== undefined ? String(val) : match;
        });
    }
}
exports.BaseNode = BaseNode;
//# sourceMappingURL=base-node.js.map