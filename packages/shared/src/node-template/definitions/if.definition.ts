import type { NodeDefinition } from '../types/node-definition';

export const ifDefinition: NodeDefinition = {
  type: 'flow.if',
  version: 1,
  category: 'FLOW',
  label: 'IF Condition',
  description: 'Binary routing based on condition',
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
    { id: 'true', label: 'True', type: 'output', schema: { type: 'any' }, fixed: true, schemaEditable: true },
    { id: 'false', label: 'False', type: 'output', schema: { type: 'any' }, fixed: true, schemaEditable: true }
  ],

  dynamicHandles: {
    inputs: false,
    outputs: false
  },

  configSchema: {
    type: 'object',
    properties: [
      { name: 'code', schema: { type: 'string', required: true } }
    ]
  },

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Input',
      component: 'HandleList'
    },
    centerPanel: {
      title: 'Condition',
      tabs: [{
        id: 'condition',
        label: 'Condition',
        fields: [{
          id: 'code',
          type: 'code',
          label: 'IF Condition',
          required: true,
          language: 'javascript',
          placeholder: 'input.age >= 18'
        }]
      }]
    },
    rightPanel: {
      title: 'Outputs',
      component: 'OutputSelector'
    }
  }
};
