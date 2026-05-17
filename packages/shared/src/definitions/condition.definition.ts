import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const conditionDefinition: NodeDefinition = {
  type: 'flow.condition',
  version: 1,
  category: NodeCategory.FLOW,
  label: 'CONDITION',
  description: 'Route input to multiple outputs based on conditions',
  shape: NodeShape.CIRCLE,

  inputHandles: [{
    id: 'in',
    label: 'Input',
    type: 'input',
    schema: { type: 'any' },
    fixed: true,
    schemaEditable: true
  }],

  outputHandles: [
    { id: 'out1', label: 'Output 1', type: 'output', schema: { type: 'any' }, fixed: false, schemaEditable: true },
    { id: 'out2', label: 'Output 2', type: 'output', schema: { type: 'any' }, fixed: false, schemaEditable: true }
  ],

  dynamicHandles: {
    inputs: false,
    outputs: true  // User can add/remove output handles
  },

  configSchema: {
    type: 'object',
    properties: [
      { name: 'conditions', schema: { type: 'array', required: true } }
    ]
  },

  config: {
    fields: [
      {
        id: 'conditions',
        type: 'cases',
        label: 'Conditions',
        required: true,
        tab: 'conditions'
      }
    ],
    tabs: ['conditions']
  },

  defaultConfigValues: {
    conditions: [
      { label: '', condition: '' },
      { label: '', condition: '' },
    ],
  }
};
