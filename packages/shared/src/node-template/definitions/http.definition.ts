import type { NodeDefinition } from '../types/node-definition';

export const httpDefinition: NodeDefinition = {
  type: 'code.http',
  version: 1,
  category: 'CODE',
  label: 'HTTP Request',
  description: 'Make HTTP/REST API calls',
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
      { name: 'method', schema: { type: 'string', required: true } },
      { name: 'url', schema: { type: 'string', required: true } },
      { name: 'headers', schema: { type: 'object', required: false } },
      { name: 'body', schema: { type: 'any', required: false } },
      { name: 'outputParser', schema: { type: 'string', required: false } }
    ]
  },

  ui: {
    layout: 'three-column',
    leftPanel: {
      title: 'Input',
      component: 'HandleList'
    },
    centerPanel: {
      title: 'Configuration',
      tabs: [{
        id: 'request',
        label: 'Request',
        fields: [
          {
            id: 'method',
            type: 'select',
            label: 'Method',
            required: true,
            default: 'GET',
            options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
          },
          {
            id: 'url',
            type: 'string',
            label: 'URL',
            required: true,
            placeholder: 'https://api.example.com/endpoint',
            supportsInterpolation: true
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
