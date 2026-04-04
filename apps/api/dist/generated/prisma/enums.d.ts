export declare const WorkflowStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus];
export declare const NodeType: {
    readonly TRIGGER: "TRIGGER";
    readonly CODE: "CODE";
    readonly CONDITION: "CONDITION";
};
export type NodeType = (typeof NodeType)[keyof typeof NodeType];
