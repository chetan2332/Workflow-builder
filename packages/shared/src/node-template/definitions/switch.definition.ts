import type { NodeDefinition } from '../types/node-definition';

export const switchDefinition: NodeDefinition = {
  type: 'flow.switch',
  version: 1,
  category: 'FLOW',
  label: 'SWITCH',
  description: 'Multi-way routing based on value matching',
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

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Input',
      component: 'HandleList'
    },
    centerPanel: {
      title: 'Switch Logic',
      tabs: [{
        id: 'switch',
        label: 'Switch',
        fields: [{
          id: 'code',
          type: 'code',
          label: 'Switch Expression',
          required: true,
          language: 'javascript',
          placeholder: 'input.status'
        }, {
          id: 'enableDefault',
          type: 'boolean',
          label: 'Enable Default Case',
          required: false,
          default: true
        }]
      }]
    },
    rightPanel: {
      title: 'Outputs',
      component: 'OutputSelector'
    }
  }
};
