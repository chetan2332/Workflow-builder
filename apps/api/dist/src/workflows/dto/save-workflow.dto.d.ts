export declare class SaveNodeDto {
    id: string;
    templateId: string;
    label?: string;
    positionX: number;
    positionY: number;
    actionState: Record<string, any>;
}
export declare class SaveEdgeDto {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string;
    targetHandle?: string;
}
export declare class UpdateWorkflowDto {
    name?: string;
    description?: string;
    status?: string;
    nodes: SaveNodeDto[];
    edges: SaveEdgeDto[];
}
