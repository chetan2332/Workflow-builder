import type { NodeDefinition } from '../types/node-definition';

export const combineDefinition: NodeDefinition = {
  type: 'flow.combine',
  version: 1,
  category: 'FLOW',
  label: 'COMBINE',
  description: 'Merge multiple inputs into single output',
  shape: 'hexagon',

  inputHandles: [
    { id: 'in1', label: 'Input 1', type: 'input', schema: { type: 'any' }, fixed: false, schemaEditable: true },
    { id: 'in2', label: 'Input 2', type: 'input', schema: { type: 'any' }, fixed: false, schemaEditable: true }
  ],

  outputHandles: [{
    id: 'out',
    label: 'Output',
    type: 'output',
    schema: { type: 'any' },
    fixed: true,
    schemaEditable: true
  }],

  dynamicHandles: {
    inputs: true,   // User can add/remove input handles
    outputs: false
  },

  configSchema: {
    type: 'object',
    properties: [
      { name: 'strategy', schema: { type: 'string', required: true } },
      { name: 'customCode', schema: { type: 'string', required: false } },
      { name: 'waitForAll', schema: { type: 'boolean', required: false } }
    ]
  },

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Inputs',
      component: 'HandleList'
    },
    centerPanel: {
      title: 'Combine Logic',
      tabs: [{
        id: 'combine',
        label: 'Combine',
        fields: [
          {
            id: 'strategy',
            type: 'select',
            label: 'Combine Strategy',
            required: true,
            default: 'mergeObjects',
            options: ['mergeObjects', 'concatArrays', 'custom']
          },
          {
            id: 'customCode',
            type: 'code',
            label: 'Custom Code',
            required: false,
            language: 'javascript',
            showWhen: "strategy === 'custom'",
            placeholder: '// Access inputs as: inputs.in1, inputs.in2\nreturn { combined: { ...inputs.in1, ...inputs.in2 } };'
          },
          {
            id: 'waitForAll',
            type: 'boolean',
            label: 'Wait for All Inputs',
            required: false,
            default: true
          }
        ]
      }]
    },
    rightPanel: {
      title: 'Output',
      component: 'HandleList'
    }
  }
};
