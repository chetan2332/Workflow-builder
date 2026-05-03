import type { NodeDefinition } from '../types/node-definition';

export const conditionDefinition: NodeDefinition = {
  type: 'flow.condition',
  version: 1,
  category: 'FLOW',
  label: 'CONDITION',
  description: 'Route input to multiple outputs based on conditions',
  shape: 'diamond',

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
      { name: 'outputHandleCount', schema: { type: 'number', required: true } },
      { name: 'conditions', schema: { type: 'array', required: true } }
    ]
  },

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Input',
      component: 'HandleList'
    },
    centerPanel: {
      title: 'Conditions',
      tabs: [{
        id: 'conditions',
        label: 'Conditions',
        fields: []  // Dynamic condition fields
      }]
    },
    rightPanel: {
      title: 'Outputs',
      component: 'OutputSelector'
    }
  }
};
