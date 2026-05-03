"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFactory = void 0;
const registry_1 = require("./registry");
const shared_1 = require("@n8n-project/shared");
class NodeFactory {
    static create(nodeData) {
        const { id, type, version, config, inputs } = nodeData;
        const definition = (0, registry_1.getNodeDefinition)(type, version);
        if (!definition) {
            throw new Error(`Unknown node type: ${type}@${version}`);
        }
        const validation = (0, shared_1.validateData)(config, definition.configSchema);
        if (!validation.valid) {
            throw new Error(`Config validation failed for ${type}: ${JSON.stringify(validation.errors)}`);
        }
        this.validateFields(config, definition);
        this.validateConditionalFields(config, definition);
        const NodeClass = (0, registry_1.getNodeClass)(type, version);
        if (!NodeClass) {
            throw new Error(`No implementation found for ${type}@${version}`);
        }
        return new NodeClass(id, definition, config, inputs);
    }
    static validateFields(config, definition) {
        const allFields = this.extractFieldsFromDefinition(definition);
        for (const field of allFields) {
            if (!(field.id in config))
                continue;
            if (!this.shouldShowField(field, config))
                continue;
            const value = config[field.id];
            if (field.validator) {
                this.runValidator(field, value, config);
            }
        }
    }
    static runValidator(field, value, config) {
        const validator = field.validator;
        switch (validator.type) {
            case 'enum':
                if (validator.enum && !validator.enum.includes(value)) {
                    throw new Error(`${field.label} must be one of: ${validator.enum.join(', ')}. Got: ${value}`);
                }
                break;
            case 'range':
                if (typeof value === 'number') {
                    if (validator.min !== undefined && value < validator.min) {
                        throw new Error(`${field.label} must be >= ${validator.min}. Got: ${value}`);
                    }
                    if (validator.max !== undefined && value > validator.max) {
                        throw new Error(`${field.label} must be <= ${validator.max}. Got: ${value}`);
                    }
                }
                break;
            case 'regex':
                if (validator.pattern && typeof value === 'string') {
                    const regex = new RegExp(validator.pattern);
                    if (!regex.test(value)) {
                        throw new Error(validator.message || `${field.label} format is invalid`);
                    }
                }
                break;
            case 'custom':
                if (validator.validate) {
                    const result = validator.validate(value, config);
                    if (typeof result === 'string') {
                        throw new Error(result);
                    }
                    if (result === false) {
                        throw new Error(`${field.label} validation failed`);
                    }
                }
                break;
        }
    }
    static validateConditionalFields(config, definition) {
        const allFields = this.extractFieldsFromDefinition(definition);
        for (const field of allFields) {
            const shouldShow = this.shouldShowField(field, config);
            if (!shouldShow && field.required && field.id in config) {
                throw new Error(`Field '${field.label}' should not be present when condition '${field.showWhen}' is false`);
            }
        }
    }
    static shouldShowField(field, config) {
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
    static extractFieldsFromDefinition(definition) {
        const fields = [];
        const panels = [
            definition.ui.leftPanel,
            definition.ui.centerPanel,
            definition.ui.rightPanel
        ].filter(Boolean);
        for (const panel of panels) {
            if (!panel?.tabs)
                continue;
            for (const tab of panel.tabs) {
                fields.push(...tab.fields);
            }
        }
        return fields;
    }
    static createAll(workflowNodes) {
        const nodes = new Map();
        for (const nodeData of workflowNodes) {
            try {
                const node = this.create(nodeData);
                nodes.set(node.id, node);
            }
            catch (error) {
                throw new Error(`Failed to create node ${nodeData.id} (${nodeData.type}): ${error.message}`);
            }
        }
        return nodes;
    }
    static validate(nodeData) {
        try {
            const definition = (0, registry_1.getNodeDefinition)(nodeData.type, nodeData.version);
            if (!definition) {
                return {
                    valid: false,
                    errors: [{ message: `Unknown node type: ${nodeData.type}` }]
                };
            }
            const validation = (0, shared_1.validateData)(nodeData.config, definition.configSchema);
            if (!validation.valid) {
                return validation;
            }
            this.validateFields(nodeData.config, definition);
            this.validateConditionalFields(nodeData.config, definition);
            return { valid: true };
        }
        catch (error) {
            return {
                valid: false,
                errors: [{ message: error.message }]
            };
        }
    }
}
exports.NodeFactory = NodeFactory;
//# sourceMappingURL=factory.js.map