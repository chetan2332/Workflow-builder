import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const switchDefinition: NodeDefinition = {
  type: 'flow.switch',
  version: 1,
  category: NodeCategory.FLOW,
  label: 'SWITCH',
  description: 'Multi-way routing based on value matching',
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
    { id: 'case1', label: 'Case 1', type: 'output', schema: { type: 'any' }, fixed: false, schemaEditable: true },
    { id: 'case2', label: 'Case 2', type: 'output', schema: { type: 'any' }, fixed: false, schemaEditable: true },
    { id: 'default', label: 'Default', type: 'output', schema: { type: 'any' }, fixed: true, schemaEditable: true }
  ],

  dynamicHandles: {
    inputs: false,
    outputs: true  // User can add/remove case outputs
  },

  configSchema: {
    type: 'object',
    properties: [
      { name: 'code', schema: { type: 'string', required: true } },
      { name: 'outputHandleCount', schema: { type: 'number', required: true } },
      { name: 'outputLabels', schema: { type: 'array', required: false } },
      { name: 'enableDefault', schema: { type: 'boolean', required: false } }
    ]
  },

  config: {
    fields: [
      {
        id: 'code',
        type: 'code',
        label: 'Switch Expression',
        required: true,
        language: 'javascript',
        placeholder: 'input.status',
        tab: 'switch'
      },
      {
        id: 'enableDefault',
        type: 'boolean',
        label: 'Enable Default Case',
        required: false,
        default: true,
        tab: 'switch'
      }
    ],
    tabs: ['switch']
  }
};
