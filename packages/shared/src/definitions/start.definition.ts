import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const startDefinition: NodeDefinition = {
  type: 'trigger.start',
  version: 1,
  category: NodeCategory.TRIGGER,
  label: 'START',
  description: 'Workflow entry point - triggers workflow execution',
  shape: NodeShape.CIRCLE,

  inputHandles: [],

  outputHandles: [{
    id: 'out',
    label: 'Output',
    type: 'output',
    schema: { type: 'any' },
    fixed: true,
    schemaEditable: true
  }],

  dynamicHandles: {
    inputs: false,
    outputs: false
  },

  configSchema: {
    type: 'object',
    properties: [
      {
        name: 'input',
        schema: {
          type: 'object',
          properties: [
            { name: 'payload', schema: { type: 'any', required: false } },
            { name: 'schema', schema: { type: 'any', required: false } }
          ]
        }
      }
    ]
  },

  config: {
    fields: [
      {
        id: 'input',
        type: 'input',
        label: 'Workflow Input',
        required: false,
        description: 'Define the input data and schema for this workflow'
      }
    ]
  },

  defaultConfigValues: {
    input: {},
  }
};
