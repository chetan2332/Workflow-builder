export declare const WorkflowStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus];
export declare const NodeCategory: {
    readonly Trigger: "Trigger";
    readonly Code: "Code";
    readonly Flow: "Flow";
    readonly Other: "Other";
};
export type NodeCategory = (typeof NodeCategory)[keyof typeof NodeCategory];
