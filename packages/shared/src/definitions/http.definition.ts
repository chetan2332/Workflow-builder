import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const httpDefinition: NodeDefinition = {
  type: 'code.http',
  version: 1,
  category: NodeCategory.CODE,
  label: 'HTTP Request',
  description: 'Make HTTP/REST API calls',
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
      { name: 'method', schema: { type: 'string', required: true } },
      { name: 'url', schema: { type: 'string', required: true } },
      { name: 'headers', schema: { type: 'array', required: false } },
      { name: 'body', schema: { type: 'any', required: false } }
    ]
  },

  config: {
    fields: [
      {
        id: 'method',
        type: 'select',
        label: 'Method',
        required: true,
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        tab: 'request'
      },
      {
        id: 'url',
        type: 'string',
        label: 'URL',
        required: true,
        placeholder: 'https://api.example.com/endpoint',
        supportsInterpolation: true,
        tab: 'request'
      },
      {
        id: 'headers',
        type: 'keyValue',
        label: 'Headers',
        required: false,
        tab: 'request'
      },
      {
        id: 'body',
        type: 'json',
        label: 'Request Body',
        required: false,
        showWhen: "config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH'",
        tab: 'request'
      }
    ],
    tabs: ['request']
  },

  defaultConfigValues: {
    method: 'GET',
    url: '',
    headers: [],
    body: {},
  }
};
