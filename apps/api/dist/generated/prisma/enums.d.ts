export declare const WorkflowStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus];
