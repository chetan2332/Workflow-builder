import { WorkflowStatus } from "generated/prisma/client";
export declare class UpdateWorkflowDto {
    id: string;
    name?: string;
    description?: string;
    status?: WorkflowStatus;
}
