import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
import { validateData, type NodeDefinition, type ConfigField } from '@n8n-project/shared';

/**
 * Base class for all CODE category nodes (HTTP, LLM, FUNCTION)
 *
 * Behavior:
 * - Input validation → Execute → Output validation → Route to handle
 * - Fixed handles: 1 input ('in'), 2 outputs ('success', 'error')
 * - Error handle has fixed schema
 * - Subclasses implement executeCode() method
 */
export abstract class CodeNode extends BaseNode {
  async execute(ctx: ExecutionContext): Promise<NodeOutput> {
    const startTime = Date.now();

    // Use definition for logging
    ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');

    const inputHandle = ctx.definition.inputHandles[0];
    const successHandle = ctx.definition.outputHandles[0];
    const errorHandle = ctx.definition.outputHandles[1];

    // Validate input handles match definition
    this.validateInputHandles(ctx);

    // Step 1: Get input data from 'in' handle
    const inputs = this.inputs[inputHandle.id];

    if (!inputs || inputs.length === 0) {
      throw new Error('No input data received');
    }

    const successResults: any[] = [];
    const errorResults: any[] = [];

    // Process each input independently
    for (const input of inputs) {
      try {
        if (input === undefined) {
          throw new Error('Input data is undefined');
        }

        // Step 2: Validate input (if schema defined in handle)
        if (inputHandle.schema) {
          ctx.tracker.log('Validating input data', 'info');
          const validation = validateData(input, inputHandle.schema);
          if (!validation.valid) {
            throw new Error(`Input validation failed: ${JSON.stringify(validation.errors)}`);
          }
        }

        // Step 3: Interpolate config based on definition
        // Only interpolate fields with supportsInterpolation: true
        const interpolatedConfig = this.interpolateConfig(ctx.config, input, ctx.definition);

        // Step 4: Validate conditional fields (showWhen)
        this.validateConditionalFields(interpolatedConfig, ctx.definition);

        // Step 5: Execute node-specific code (ABSTRACT METHOD)
        ctx.tracker.log('Executing node logic...', 'info');
        const result = await this.executeCode(input, {
          ...ctx,
          config: interpolatedConfig  // Use interpolated config
        });

        // Step 6: Validate output (if schema defined in handle)
        if (successHandle.schema) {
          ctx.tracker.log('Validating output data', 'info');
          const validation = validateData(result, successHandle.schema);
          if (!validation.valid) {
            throw new Error(`Output validation failed: ${JSON.stringify(validation.errors)}`);
          }
        }

        // Success - add to success results
        successResults.push(result);

      } catch (error: any) {
        // Failure - add to error results with fixed schema
        ctx.tracker.log(`Failed to process input: ${error.message}`, 'error');
        errorResults.push({
          error: true,
          message: error.message,
          code: error.code || 'EXECUTION_ERROR',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          input: input  // Include the input that caused the error
        });
      }
    }

    ctx.tracker.log(
      `${ctx.definition.label} completed: ${successResults.length} succeeded, ${errorResults.length} failed`,
      'info'
    );

    // Step 7: Route to both handles based on results
    return {
      outputs: {
        [successHandle.id]: successResults,
        [errorHandle.id]: errorResults
      },
      metadata: {
        duration: Date.now() - startTime,
        itemsProcessed: inputs.length
      }
    };
  }

  /**
   * Validate that hidden fields (showWhen=false) don't have required values
   */
  protected validateConditionalFields(config: any, definition: NodeDefinition): void {
    const allFields = this.extractFieldsFromDefinition(definition);

    for (const field of allFields) {
      const shouldShow = this.shouldShowField(field, config);

      if (!shouldShow && field.required && field.id in config) {
        throw new Error(
          `Field '${field.label}' should not be present when condition '${field.showWhen}' is false`
        );
      }
    }
  }

  /**
   * Subclasses implement ONLY this method
   * No need to worry about validation, error handling, routing
   *
   * @param input - Validated input data
   * @param ctx - Execution context (with interpolated config)
   * @returns Result data (will be validated against success schema)
   */
  protected abstract executeCode(input: any, ctx: ExecutionContext): Promise<any[]>;

  /**
   * Helper: Interpolate {{input.field}} in strings
   * Available to all CODE nodes
   */
  protected interpolate(template: string | any, input: any): any {
    if (typeof template !== 'string') {
      return template;
    }

    return template.replace(/\{\{input\.(\w+)\}\}/g, (match, key) => {
      const value = input[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Helper: Interpolate object (e.g., headers, body)
   */
  protected interpolateObject(obj: Record<string, any> | undefined, input: any): Record<string, any> {
    if (!obj) return {};

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = this.interpolate(value, input);
    }
    return result;
  }
}
