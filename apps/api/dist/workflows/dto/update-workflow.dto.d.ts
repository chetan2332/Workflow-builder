import type { WorkflowNode, WorkflowEdge, WorkflowStatus } from '@n8n-project/shared';
export declare class UpdateWorkflowDto {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: string;
    updatedAt: string;
}
