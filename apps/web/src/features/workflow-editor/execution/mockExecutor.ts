import type { NodeTemplateConfig } from '../../../nodeConfigSchema';
import type { HandleDefinition } from '../dialog/types';

/**
 * Mock execution engine for testing nodes in isolation
 * Phase 3: Replace with real sandboxed execution later
 */
export async function executeNode(
  template: NodeTemplateConfig,
  handles: { inputs: HandleDefinition[]; outputs: HandleDefinition[] },
  config: Record<string, any>
): Promise<{ inputs: HandleDefinition[]; outputs: HandleDefinition[] }> {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const inputs = handles.inputs.map(h => h.testData);
  const updatedOutputs = [...handles.outputs];

  try {
    switch (template.nodeType) {
      case 'TRIGGER':
        // Start node: pass through the sample payload
        if (handles.outputs.length > 0) {
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: config.samplePayload ? JSON.parse(config.samplePayload) : {},
          };
        }
        break;

      case 'CONDITION':
        // If/Switch nodes: evaluate condition/expression
        if (template.nodeId === 'IF') {
          const result = evaluateIfCondition(config.code || 'return true', inputs);

          updatedOutputs.forEach(h => {
            if (h.id === 'out-true') {
              h.fired = result;
              h.outputData = result ? inputs[0] : null;
            }
            if (h.id === 'out-false') {
              h.fired = !result;
              h.outputData = !result ? inputs[0] : null;
            }
          });
        } else if (template.nodeId === 'SWITCH') {
          const caseIndex = evaluateSwitchExpression(config.code || 'return 0', inputs);

          updatedOutputs.forEach((h, index) => {
            h.fired = index === caseIndex;
            h.outputData = h.fired ? inputs[0] : null;
          });
        }
        break;

      case 'CODE':
        // Function/HTTP/LLM nodes
        if (template.nodeId === 'FUNCTION') {
          const result = evaluateFunctionCode(config.code || 'return inputs[0]', inputs);
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: result,
          };
        } else if (template.nodeId === 'HTTP') {
          // Mock HTTP execution
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: {
              status: 200,
              statusText: 'OK',
              headers: { 'content-type': 'application/json' },
              body: { message: 'Mock HTTP response' },
            },
          };
        } else if (template.nodeId === 'LLM') {
          // Mock LLM execution
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: {
              completion: 'This is a mock LLM response',
              model: config.modelId || 'unknown',
              usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            },
          };
        }
        break;

      case 'OTHER':
        // Input, Transform, Do Nothing
        if (template.nodeId === 'INPUT') {
          // Input node: emit configured value
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: getInputValue(config),
          };
        } else if (template.nodeId === 'DO_NOTHING') {
          // Do nothing - no outputs
        }
        break;

      default:
        // Unknown node type - pass through first input
        if (updatedOutputs.length > 0) {
          updatedOutputs[0] = {
            ...updatedOutputs[0],
            fired: true,
            outputData: inputs[0] || null,
          };
        }
    }

    return { inputs: handles.inputs, outputs: updatedOutputs };
  } catch (error: any) {
    throw new Error(`Execution error: ${error.message}`);
  }
}

/**
 * Evaluate If node condition code
 */
function evaluateIfCondition(code: string, inputs: any[]): boolean {
  try {
    // Wrap code in function
    const wrappedCode = code.includes('return') ? code : `return ${code}`;
    const fn = new Function('inputs', wrappedCode);
    return Boolean(fn(inputs));
  } catch (e: any) {
    throw new Error(`Condition evaluation error: ${e.message}`);
  }
}

/**
 * Evaluate Switch node expression
 */
function evaluateSwitchExpression(code: string, inputs: any[]): number {
  try {
    const wrappedCode = code.includes('return') ? code : `return ${code}`;
    const fn = new Function('inputs', wrappedCode);
    const result = fn(inputs);
    return Number(result) || 0;
  } catch (e: any) {
    throw new Error(`Switch expression error: ${e.message}`);
  }
}

/**
 * Evaluate Function node code
 */
function evaluateFunctionCode(code: string, inputs: any[]): any {
  try {
    const wrappedCode = code.includes('return') ? code : `return ${code}`;
    const fn = new Function('inputs', wrappedCode);
    return fn(inputs);
  } catch (e: any) {
    throw new Error(`Function execution error: ${e.message}`);
  }
}

/**
 * Get value from Input node config
 */
function getInputValue(config: Record<string, any>): any {
  const valueKind = config.valueKind || 'text';

  switch (valueKind) {
    case 'text':
      return config.text || '';
    case 'number':
      return config.number || 0;
    case 'boolean':
      return config.boolean || false;
    case 'json':
      try {
        return JSON.parse(config.json || '{}');
      } catch {
        return {};
      }
    default:
      return null;
  }
}
