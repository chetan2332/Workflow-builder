import type { WorkflowNode, WorkflowEdge, WorkflowStatus } from '@n8n-project/shared';

// Class DTO matching WorkflowDetail structure
export class UpdateWorkflowDto {
    id!: string;
    name!: string;
    description!: string;
    status!: WorkflowStatus;
    nodes!: WorkflowNode[];
    edges!: WorkflowEdge[];
    createdAt!: string;
    updatedAt!: string;
}
