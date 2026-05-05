import type { WorkflowNode, WorkflowEdge, WorkflowStatus } from '@n8n-project/shared';

// Class DTO matching WorkflowDetail structure with defaults
export class CreateWorkflowDto {
    name!: string;
    description: string = '';
    status: WorkflowStatus = 'DRAFT';
    nodes: WorkflowNode[] = [];
    edges: WorkflowEdge[] = [];
}
