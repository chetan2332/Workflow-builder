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
      { name: 'provider', schema: { type: 'string', required: true } },
      { name: 'apiKey', schema: { type: 'string', required: true } },
      { name: 'modelId', schema: { type: 'string', required: true } },
      { name: 'baseUrl', schema: { type: 'string', required: false } },
      { name: 'systemPrompt', schema: { type: 'string', required: false } },
      { name: 'userPrompt', schema: { type: 'string', required: true } },
      { name: 'temperature', schema: { type: 'number', required: false } },
      { name: 'maxTokens', schema: { type: 'number', required: false } }
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
        id: 'apiKey',
        type: 'string',
        label: 'API Key',
        required: true,
        placeholder: 'sk-...',
        description: 'Your provider API key',
        tab: 'model'
      },
      {
        id: 'modelId',
        type: 'select',
        label: 'Model',
        required: true,
        options: [
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
        ],
        showWhen: "config.provider === 'openai'",
        tab: 'model'
      },
      {
        id: 'modelId',
        type: 'select',
        label: 'Model',
        required: true,
        options: [
          { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
          { value: 'claude-haiku-4-20250414', label: 'Claude Haiku 4' },
          { value: 'claude-opus-4-20250414', label: 'Claude Opus 4' }
        ],
        showWhen: "config.provider === 'anthropic'",
        tab: 'model'
      },
      {
        id: 'modelId',
        type: 'string',
        label: 'Model ID',
        required: true,
        placeholder: 'e.g. my-model-name',
        description: 'Model identifier for your custom endpoint',
        showWhen: "config.provider === 'custom'",
        tab: 'model'
      },
      {
        id: 'baseUrl',
        type: 'string',
        label: 'Base URL',
        required: true,
        placeholder: 'https://your-endpoint.com/v1',
        description: 'OpenAI-compatible API base URL',
        showWhen: "config.provider === 'custom'",
        tab: 'model'
      },
      {
        id: 'temperature',
        type: 'number',
        label: 'Temperature',
        required: false,
        default: 0.7,
        min: 0,
        max: 2,
        step: 0.1,
        description: 'Controls randomness (0 = deterministic, 2 = very creative)',
        tab: 'model'
      },
      {
        id: 'maxTokens',
        type: 'number',
        label: 'Max Tokens',
        required: false,
        default: 1024,
        min: 1,
        max: 128000,
        description: 'Maximum tokens in the response',
        tab: 'model'
      },
      {
        id: 'systemPrompt',
        type: 'textarea',
        label: 'System Prompt',
        required: false,
        supportsInterpolation: true,
        placeholder: 'You are a helpful assistant...',
        tab: 'prompt'
      },
      {
        id: 'userPrompt',
        type: 'textarea',
        label: 'User Prompt',
        required: true,
        supportsInterpolation: true,
        placeholder: 'Use {{input.fieldName}} to reference input data',
        tab: 'prompt'
      }
    ],
    tabs: ['model', 'prompt']
  },

  defaultConfigValues: {
    provider: 'openai',
    apiKey: '',
    modelId: 'gpt-4o-mini',
    baseUrl: '',
    systemPrompt: '',
    userPrompt: '',
    temperature: 0.7,
    maxTokens: 1024,
  }
};
