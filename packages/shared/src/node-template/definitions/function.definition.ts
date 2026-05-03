import type { NodeDefinition } from '../types/node-definition';

export const functionDefinition: NodeDefinition = {
  type: 'code.function',
  version: 1,
  category: 'CODE',
  label: 'FUNCTION',
  description: 'Execute custom JavaScript code',
  shape: 'rectangle',

  inputHandles: [{
    id: 'in',
    label: 'Input',
    type: 'input',
    schema: { type: 'any' },
    fixed: true,
    schemaEditable: true
  }],

  outputHandles: [
    {
      id: 'success',
      label: 'Success',
      type: 'output',
      schema: { type: 'any' },
      fixed: true,
      schemaEditable: true
    },
    {
      id: 'error',
      label: 'Error',
      type: 'output',
      schema: {
        type: 'object',
        properties: [
          { name: 'error', schema: { type: 'boolean', required: true } },
          { name: 'message', schema: { type: 'string', required: true } },
          { name: 'code', schema: { type: 'string', required: false } },
          { name: 'stack', schema: { type: 'string', required: false } }
        ]
      },
      fixed: true,
      schemaEditable: false
    }
  ],

  dynamicHandles: {
    inputs: false,
    outputs: false
  },

  configSchema: {
    type: 'object',
    properties: [
      { name: 'language', schema: { type: 'string', required: true } },
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
      title: 'Code',
      tabs: [{
        id: 'code',
        label: 'Code',
        fields: [
          {
            id: 'language',
            type: 'select',
            label: 'Language',
            required: true,
            default: 'javascript',
            options: ['javascript', 'python']
          },
          {
            id: 'code',
            type: 'code',
            label: 'Function Code',
            required: true,
            language: 'javascript',
            placeholder: '// Access input like: input.user, input.email\nreturn { result: input.value * 2 };'
          }
        ]
      }]
    },
    rightPanel: {
      title: 'Output',
      component: 'OutputSelector'
    }
  }
};
