import { NodeValidationResult } from '../types/execution.types';
import type { NodeTemplate } from '@n8n-project/shared';
export declare class Validator {
    validateConfig(config: Record<string, unknown>, template: NodeTemplate): NodeValidationResult;
}
