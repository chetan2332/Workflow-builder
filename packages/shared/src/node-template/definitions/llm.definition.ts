import type { NodeDefinition } from '../types/node-definition';

export const llmDefinition: NodeDefinition = {
  type: 'code.llm',
  version: 1,
  category: 'CODE',
  label: 'LLM',
  description: 'Call Large Language Models',
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
      { name: 'provider', schema: { type: 'string', required: true } },
      { name: 'modelId', schema: { type: 'string', required: true } },
      { name: 'systemPrompt', schema: { type: 'string', required: false } },
      { name: 'userPrompt', schema: { type: 'string', required: true } },
      { name: 'temperature', schema: { type: 'number', required: false } }
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
        id: 'model',
        label: 'Model',
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
            }
          },
          {
            id: 'modelId',
            type: 'select',
            label: 'Model',
            required: true,
            options: 'dynamic'
          }
        ]
      }, {
        id: 'prompt',
        label: 'Prompt',
        fields: [
          {
            id: 'systemPrompt',
            type: 'textarea',
            label: 'System Prompt',
            required: false,
            supportsInterpolation: true
          },
          {
            id: 'userPrompt',
            type: 'textarea',
            label: 'User Prompt',
            required: true,
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
