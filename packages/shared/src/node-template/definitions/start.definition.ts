import type { NodeDefinition } from '../types/node-definition';

export const startDefinition: NodeDefinition = {
  type: 'trigger.start',
  version: 1,
  category: 'TRIGGER',
  label: 'START',
  description: 'Workflow entry point - triggers workflow execution',
  shape: 'circle',

  inputHandles: [],  // No inputs - this is the entry point

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
      { name: 'samplePayload', schema: { type: 'any', required: false } },
      { name: 'inputSchema', schema: { type: 'any', required: false } },
      { name: 'enforceSchema', schema: { type: 'boolean', required: false } }
    ]
  },

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Sample Payload',
      tabs: [{
        id: 'payload',
        label: 'Payload',
        fields: [{
          id: 'samplePayload',
          type: 'json',
          label: 'Sample Payload',
          required: false,
          placeholder: '{}',
          description: 'Test data for manual workflow runs'
        }]
      }]
    },
    centerPanel: {
      title: 'Input Schema',
      description: 'Define the structure of expected input data',
      component: 'SchemaBuilder',
      tabs: [{
        id: 'schema',
        label: 'Schema',
        fields: [{
          id: 'inputSchema',
          type: 'json',
          label: 'Input Schema',
          required: false
        }, {
          id: 'enforceSchema',
          type: 'boolean',
          label: 'Enforce Schema',
          required: false,
          default: false
        }]
      }]
    },
    rightPanel: {
      title: 'Output',
      description: 'Full right side for single output handle',
      component: 'HandleList'
    }
  }
};
