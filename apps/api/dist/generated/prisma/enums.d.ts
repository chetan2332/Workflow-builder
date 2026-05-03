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
    readonly OTHER: "OTHER";
};
export type NodeType = (typeof NodeType)[keyof typeof NodeType];
export declare const NodeShape: {
    readonly CIRCLE: "CIRCLE";
    readonly OPPOSITE_D: "OPPOSITE_D";
    readonly ROUNDED_RECTANGLE: "ROUNDED_RECTANGLE";
    readonly RECTANGLE_WITH_TEXT: "RECTANGLE_WITH_TEXT";
};
export type NodeShape = (typeof NodeShape)[keyof typeof NodeShape];
