import { Injectable } from '@nestjs/common';
import { NodeValidationResult } from '../types/execution.types';
import type { NodeTemplate } from '@n8n-project/shared';

@Injectable()
export class Validator {
  validateConfig(
    config: Record<string, unknown>,
    template: NodeTemplate,
  ): NodeValidationResult {
    // TODO: Implement full validation
    // For now, return valid
    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  }
}