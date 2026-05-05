import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const llmDefinition: NodeDefinition = {
  type: 'code.llm',
  version: 1,
  category: NodeCategory.CODE,
  label: 'LLM',
  description: 'Call Large Language Models',
  shape: NodeShape.ROUNDED_RECTANGLE,

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
      { name: 'provider', schema: { type: 'string', required: true } },
      { name: 'modelId', schema: { type: 'string', required: true } },
      { name: 'systemPrompt', schema: { type: 'string', required: false } },
      { name: 'userPrompt', schema: { type: 'string', required: true } },
      { name: 'temperature', schema: { type: 'number', required: false } }
    ]
  },

  config: {
    fields: [
      {
        id: 'provider',
        type: 'select',
        label: 'Provider',
        required: true,
        default: 'openai',
        options: ['openai', 'anthropic', 'custom'],
        validator: {
          type: 'enum',
          enum: ['openai', 'anthropic', 'custom']
        },
        tab: 'model'
      },
      {
        id: 'modelId',
        type: 'select',
        label: 'Model',
        required: true,
        options: 'dynamic',
        tab: 'model'
      },
      {
        id: 'systemPrompt',
        type: 'textarea',
        label: 'System Prompt',
        required: false,
        supportsInterpolation: true,
        tab: 'prompt'
      },
      {
        id: 'userPrompt',
        type: 'textarea',
        label: 'User Prompt',
        required: true,
        supportsInterpolation: true,
        tab: 'prompt'
      }
    ],
    tabs: ['model', 'prompt']
  }
};
