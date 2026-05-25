import type { WorkflowNode, WorkflowEdge, WorkflowStatus } from '@n8n-project/shared';
export declare class CreateWorkflowDto {
    name: string;
    description: string;
    status: WorkflowStatus;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}
