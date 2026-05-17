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
      { name: 'cases', schema: { type: 'array', required: true } }
    ]
  },

  config: {
    fields: [
      {
        id: 'cases',
        type: 'cases',
        label: 'Cases',
        required: true,
        tab: 'switch'
      }
    ],
    tabs: ['switch']
  },

  defaultConfigValues: {
    cases: [
      { label: '', condition: '' },
      { label: '', condition: '' },
    ],
  }
};
