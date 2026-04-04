import { Edge, Node, WorkflowStatus } from "generated/prisma/client";

export class UpdateWorkflowDto {
    id: string;
    name?: string;
    description?: string;
    status?: WorkflowStatus;
}
