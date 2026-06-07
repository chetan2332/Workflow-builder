import { Injectable } from '@nestjs/common';
import {
  startDefinition,
  httpDefinition,
  llmDefinition,
  functionDefinition,
  ifDefinition,
  switchDefinition,
  conditionDefinition,
  combineDefinition
} from '@n8n-project/shared';
import type { NodeDefinition } from '@n8n-project/shared';

export interface RegistryEntry {
  definition: NodeDefinition;
}

export const NodeRegistry: Record<string, Record<number, RegistryEntry>> = {
  'trigger.start': {
    1: {
      definition: startDefinition
    }
  },

  'code.http': {
    1: {
      definition: httpDefinition
    }
  },

  'code.llm': {
    1: {
      definition: llmDefinition
    }
  },

  'code.function': {
    1: {
      definition: functionDefinition
    }
  },

  'flow.if': {
    1: {
      definition: ifDefinition
    }
  },

  'flow.switch': {
    1: {
      definition: switchDefinition
    }
  },

  'flow.condition': {
    1: {
      definition: conditionDefinition
    }
  },

  'flow.combine': {
    1: {
      definition: combineDefinition
    }
  }
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getNodes(): NodeDefinition[] {
    return Object.values(NodeRegistry).flatMap((versions) =>
      Object.values(versions).map((entry) => entry.definition)
    );
  }
}
