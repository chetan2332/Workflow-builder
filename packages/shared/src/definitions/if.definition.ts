import { NodeDefinition, NodeCategory, NodeShape } from './types.js';

export const ifDefinition: NodeDefinition = {
  type: 'flow.if',
  version: 1,
  category: NodeCategory.FLOW,
  label: 'IF Condition',
  description: 'Binary routing based on condition',
  shape: NodeShape.CIRCLE,

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

  config: {
    fields: [{
      id: 'code',
      type: 'code',
      label: 'IF Condition',
      required: true,
      language: 'javascript',
      placeholder: 'input.age >= 18',
      tab: 'condition'
    }],
    tabs: ['condition']
  }
};
