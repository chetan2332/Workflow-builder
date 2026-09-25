import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const functionDefinition: NodeDefinition = {
  type: 'code.function',
  version: 1,
  category: NodeCategory.CODE,
  label: 'FUNCTION',
  description: 'Execute custom JavaScript code',
  shape: NodeShape.ROUNDED_RECTANGLE,

  inputHandles: [{
    id: 'in',
    label: 'Input',
    type: 'input',
    schema: { type: 'object', properties: [] },
    fixed: true,
    schemaEditable: true
  }],

  outputHandles: [
    {
      id: 'success',
      label: 'Success',
      type: 'output',
      schema: { type: 'object', properties: [] },
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
      { name: 'code', schema: { type: 'string', required: true } }
    ]
  },

  config: {
    fields: [
      {
        id: 'code',
        type: 'code',
        label: 'Function Code',
        required: true,
        language: 'javascript',
        placeholder: '// Access input like: input.user, input.email\nreturn { result: input.value * 2 };',
        tab: 'code'
      }
    ],
    tabs: ['code']
  },

  defaultConfigValues: {
    code: '',
  }
};
