import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type NodeTemplateModel = runtime.Types.Result.DefaultSelection<Prisma.$NodeTemplatePayload>;
export type AggregateNodeTemplate = {
    _count: NodeTemplateCountAggregateOutputType | null;
    _min: NodeTemplateMinAggregateOutputType | null;
    _max: NodeTemplateMaxAggregateOutputType | null;
};
export type NodeTemplateMinAggregateOutputType = {
    id: string | null;
    templateId: string | null;
    version: string | null;
    name: string | null;
    description: string | null;
    nodeType: $Enums.NodeType | null;
    shape: $Enums.NodeShape | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type NodeTemplateMaxAggregateOutputType = {
    id: string | null;
    templateId: string | null;
    version: string | null;
    name: string | null;
    description: string | null;
    nodeType: $Enums.NodeType | null;
    shape: $Enums.NodeShape | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type NodeTemplateCountAggregateOutputType = {
    id: number;
    templateId: number;
    version: number;
    name: number;
    description: number;
    nodeType: number;
    shape: number;
    handlesConfig: number;
    actionConfig: number;
    dynamicHandles: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type NodeTemplateMinAggregateInputType = {
    id?: true;
    templateId?: true;
    version?: true;
    name?: true;
    description?: true;
    nodeType?: true;
    shape?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type NodeTemplateMaxAggregateInputType = {
    id?: true;
    templateId?: true;
    version?: true;
    name?: true;
    description?: true;
    nodeType?: true;
    shape?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type NodeTemplateCountAggregateInputType = {
    id?: true;
    templateId?: true;
    version?: true;
    name?: true;
    description?: true;
    nodeType?: true;
    shape?: true;
    handlesConfig?: true;
    actionConfig?: true;
    dynamicHandles?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type NodeTemplateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeTemplateWhereInput;
    orderBy?: Prisma.NodeTemplateOrderByWithRelationInput | Prisma.NodeTemplateOrderByWithRelationInput[];
    cursor?: Prisma.NodeTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | NodeTemplateCountAggregateInputType;
    _min?: NodeTemplateMinAggregateInputType;
    _max?: NodeTemplateMaxAggregateInputType;
};
export type GetNodeTemplateAggregateType<T extends NodeTemplateAggregateArgs> = {
    [P in keyof T & keyof AggregateNodeTemplate]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateNodeTemplate[P]> : Prisma.GetScalarType<T[P], AggregateNodeTemplate[P]>;
};
export type NodeTemplateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeTemplateWhereInput;
    orderBy?: Prisma.NodeTemplateOrderByWithAggregationInput | Prisma.NodeTemplateOrderByWithAggregationInput[];
    by: Prisma.NodeTemplateScalarFieldEnum[] | Prisma.NodeTemplateScalarFieldEnum;
    having?: Prisma.NodeTemplateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NodeTemplateCountAggregateInputType | true;
    _min?: NodeTemplateMinAggregateInputType;
    _max?: NodeTemplateMaxAggregateInputType;
};
export type NodeTemplateGroupByOutputType = {
    id: string;
    templateId: string;
    version: string;
    name: string;
    description: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: runtime.JsonValue;
    actionConfig: runtime.JsonValue | null;
    dynamicHandles: runtime.JsonValue | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: NodeTemplateCountAggregateOutputType | null;
    _min: NodeTemplateMinAggregateOutputType | null;
    _max: NodeTemplateMaxAggregateOutputType | null;
};
type GetNodeTemplateGroupByPayload<T extends NodeTemplateGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<NodeTemplateGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof NodeTemplateGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], NodeTemplateGroupByOutputType[P]> : Prisma.GetScalarType<T[P], NodeTemplateGroupByOutputType[P]>;
}>>;
export type NodeTemplateWhereInput = {
    AND?: Prisma.NodeTemplateWhereInput | Prisma.NodeTemplateWhereInput[];
    OR?: Prisma.NodeTemplateWhereInput[];
    NOT?: Prisma.NodeTemplateWhereInput | Prisma.NodeTemplateWhereInput[];
    id?: Prisma.StringFilter<"NodeTemplate"> | string;
    templateId?: Prisma.StringFilter<"NodeTemplate"> | string;
    version?: Prisma.StringFilter<"NodeTemplate"> | string;
    name?: Prisma.StringFilter<"NodeTemplate"> | string;
    description?: Prisma.StringNullableFilter<"NodeTemplate"> | string | null;
    nodeType?: Prisma.EnumNodeTypeFilter<"NodeTemplate"> | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFilter<"NodeTemplate"> | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonFilter<"NodeTemplate">;
    actionConfig?: Prisma.JsonNullableFilter<"NodeTemplate">;
    dynamicHandles?: Prisma.JsonNullableFilter<"NodeTemplate">;
    isActive?: Prisma.BoolFilter<"NodeTemplate"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"NodeTemplate"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"NodeTemplate"> | Date | string;
    nodes?: Prisma.NodeListRelationFilter;
};
export type NodeTemplateOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    nodeType?: Prisma.SortOrder;
    shape?: Prisma.SortOrder;
    handlesConfig?: Prisma.SortOrder;
    actionConfig?: Prisma.SortOrderInput | Prisma.SortOrder;
    dynamicHandles?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    nodes?: Prisma.NodeOrderByRelationAggregateInput;
};
export type NodeTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    templateId_version?: Prisma.NodeTemplateTemplateIdVersionCompoundUniqueInput;
    AND?: Prisma.NodeTemplateWhereInput | Prisma.NodeTemplateWhereInput[];
    OR?: Prisma.NodeTemplateWhereInput[];
    NOT?: Prisma.NodeTemplateWhereInput | Prisma.NodeTemplateWhereInput[];
    templateId?: Prisma.StringFilter<"NodeTemplate"> | string;
    version?: Prisma.StringFilter<"NodeTemplate"> | string;
    name?: Prisma.StringFilter<"NodeTemplate"> | string;
    description?: Prisma.StringNullableFilter<"NodeTemplate"> | string | null;
    nodeType?: Prisma.EnumNodeTypeFilter<"NodeTemplate"> | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFilter<"NodeTemplate"> | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonFilter<"NodeTemplate">;
    actionConfig?: Prisma.JsonNullableFilter<"NodeTemplate">;
    dynamicHandles?: Prisma.JsonNullableFilter<"NodeTemplate">;
    isActive?: Prisma.BoolFilter<"NodeTemplate"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"NodeTemplate"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"NodeTemplate"> | Date | string;
    nodes?: Prisma.NodeListRelationFilter;
}, "id" | "templateId_version">;
export type NodeTemplateOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    nodeType?: Prisma.SortOrder;
    shape?: Prisma.SortOrder;
    handlesConfig?: Prisma.SortOrder;
    actionConfig?: Prisma.SortOrderInput | Prisma.SortOrder;
    dynamicHandles?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.NodeTemplateCountOrderByAggregateInput;
    _max?: Prisma.NodeTemplateMaxOrderByAggregateInput;
    _min?: Prisma.NodeTemplateMinOrderByAggregateInput;
};
export type NodeTemplateScalarWhereWithAggregatesInput = {
    AND?: Prisma.NodeTemplateScalarWhereWithAggregatesInput | Prisma.NodeTemplateScalarWhereWithAggregatesInput[];
    OR?: Prisma.NodeTemplateScalarWhereWithAggregatesInput[];
    NOT?: Prisma.NodeTemplateScalarWhereWithAggregatesInput | Prisma.NodeTemplateScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"NodeTemplate"> | string;
    templateId?: Prisma.StringWithAggregatesFilter<"NodeTemplate"> | string;
    version?: Prisma.StringWithAggregatesFilter<"NodeTemplate"> | string;
    name?: Prisma.StringWithAggregatesFilter<"NodeTemplate"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"NodeTemplate"> | string | null;
    nodeType?: Prisma.EnumNodeTypeWithAggregatesFilter<"NodeTemplate"> | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeWithAggregatesFilter<"NodeTemplate"> | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonWithAggregatesFilter<"NodeTemplate">;
    actionConfig?: Prisma.JsonNullableWithAggregatesFilter<"NodeTemplate">;
    dynamicHandles?: Prisma.JsonNullableWithAggregatesFilter<"NodeTemplate">;
    isActive?: Prisma.BoolWithAggregatesFilter<"NodeTemplate"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"NodeTemplate"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"NodeTemplate"> | Date | string;
};
export type NodeTemplateCreateInput = {
    id?: string;
    templateId: string;
    version?: string;
    name: string;
    description?: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeCreateNestedManyWithoutTemplateInput;
};
export type NodeTemplateUncheckedCreateInput = {
    id?: string;
    templateId: string;
    version?: string;
    name: string;
    description?: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeUncheckedCreateNestedManyWithoutTemplateInput;
};
export type NodeTemplateUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUpdateManyWithoutTemplateNestedInput;
};
export type NodeTemplateUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUncheckedUpdateManyWithoutTemplateNestedInput;
};
export type NodeTemplateCreateManyInput = {
    id?: string;
    templateId: string;
    version?: string;
    name: string;
    description?: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type NodeTemplateUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeTemplateUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeTemplateTemplateIdVersionCompoundUniqueInput = {
    templateId: string;
    version: string;
};
export type NodeTemplateCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    nodeType?: Prisma.SortOrder;
    shape?: Prisma.SortOrder;
    handlesConfig?: Prisma.SortOrder;
    actionConfig?: Prisma.SortOrder;
    dynamicHandles?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeTemplateMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    nodeType?: Prisma.SortOrder;
    shape?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeTemplateMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    nodeType?: Prisma.SortOrder;
    shape?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeTemplateScalarRelationFilter = {
    is?: Prisma.NodeTemplateWhereInput;
    isNot?: Prisma.NodeTemplateWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumNodeTypeFieldUpdateOperationsInput = {
    set?: $Enums.NodeType;
};
export type EnumNodeShapeFieldUpdateOperationsInput = {
    set?: $Enums.NodeShape;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NodeTemplateCreateNestedOneWithoutNodesInput = {
    create?: Prisma.XOR<Prisma.NodeTemplateCreateWithoutNodesInput, Prisma.NodeTemplateUncheckedCreateWithoutNodesInput>;
    connectOrCreate?: Prisma.NodeTemplateCreateOrConnectWithoutNodesInput;
    connect?: Prisma.NodeTemplateWhereUniqueInput;
};
export type NodeTemplateUpdateOneRequiredWithoutNodesNestedInput = {
    create?: Prisma.XOR<Prisma.NodeTemplateCreateWithoutNodesInput, Prisma.NodeTemplateUncheckedCreateWithoutNodesInput>;
    connectOrCreate?: Prisma.NodeTemplateCreateOrConnectWithoutNodesInput;
    upsert?: Prisma.NodeTemplateUpsertWithoutNodesInput;
    connect?: Prisma.NodeTemplateWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.NodeTemplateUpdateToOneWithWhereWithoutNodesInput, Prisma.NodeTemplateUpdateWithoutNodesInput>, Prisma.NodeTemplateUncheckedUpdateWithoutNodesInput>;
};
export type NodeTemplateCreateWithoutNodesInput = {
    id?: string;
    templateId: string;
    version?: string;
    name: string;
    description?: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type NodeTemplateUncheckedCreateWithoutNodesInput = {
    id?: string;
    templateId: string;
    version?: string;
    name: string;
    description?: string | null;
    nodeType: $Enums.NodeType;
    shape: $Enums.NodeShape;
    handlesConfig: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type NodeTemplateCreateOrConnectWithoutNodesInput = {
    where: Prisma.NodeTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeTemplateCreateWithoutNodesInput, Prisma.NodeTemplateUncheckedCreateWithoutNodesInput>;
};
export type NodeTemplateUpsertWithoutNodesInput = {
    update: Prisma.XOR<Prisma.NodeTemplateUpdateWithoutNodesInput, Prisma.NodeTemplateUncheckedUpdateWithoutNodesInput>;
    create: Prisma.XOR<Prisma.NodeTemplateCreateWithoutNodesInput, Prisma.NodeTemplateUncheckedCreateWithoutNodesInput>;
    where?: Prisma.NodeTemplateWhereInput;
};
export type NodeTemplateUpdateToOneWithWhereWithoutNodesInput = {
    where?: Prisma.NodeTemplateWhereInput;
    data: Prisma.XOR<Prisma.NodeTemplateUpdateWithoutNodesInput, Prisma.NodeTemplateUncheckedUpdateWithoutNodesInput>;
};
export type NodeTemplateUpdateWithoutNodesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeTemplateUncheckedUpdateWithoutNodesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    templateId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nodeType?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    shape?: Prisma.EnumNodeShapeFieldUpdateOperationsInput | $Enums.NodeShape;
    handlesConfig?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    actionConfig?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    dynamicHandles?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeTemplateCountOutputType = {
    nodes: number;
};
export type NodeTemplateCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    nodes?: boolean | NodeTemplateCountOutputTypeCountNodesArgs;
};
export type NodeTemplateCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateCountOutputTypeSelect<ExtArgs> | null;
};
export type NodeTemplateCountOutputTypeCountNodesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
};
export type NodeTemplateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    version?: boolean;
    name?: boolean;
    description?: boolean;
    nodeType?: boolean;
    shape?: boolean;
    handlesConfig?: boolean;
    actionConfig?: boolean;
    dynamicHandles?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    nodes?: boolean | Prisma.NodeTemplate$nodesArgs<ExtArgs>;
    _count?: boolean | Prisma.NodeTemplateCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["nodeTemplate"]>;
export type NodeTemplateSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    version?: boolean;
    name?: boolean;
    description?: boolean;
    nodeType?: boolean;
    shape?: boolean;
    handlesConfig?: boolean;
    actionConfig?: boolean;
    dynamicHandles?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["nodeTemplate"]>;
export type NodeTemplateSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    version?: boolean;
    name?: boolean;
    description?: boolean;
    nodeType?: boolean;
    shape?: boolean;
    handlesConfig?: boolean;
    actionConfig?: boolean;
    dynamicHandles?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["nodeTemplate"]>;
export type NodeTemplateSelectScalar = {
    id?: boolean;
    templateId?: boolean;
    version?: boolean;
    name?: boolean;
    description?: boolean;
    nodeType?: boolean;
    shape?: boolean;
    handlesConfig?: boolean;
    actionConfig?: boolean;
    dynamicHandles?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type NodeTemplateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "templateId" | "version" | "name" | "description" | "nodeType" | "shape" | "handlesConfig" | "actionConfig" | "dynamicHandles" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["nodeTemplate"]>;
export type NodeTemplateInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    nodes?: boolean | Prisma.NodeTemplate$nodesArgs<ExtArgs>;
    _count?: boolean | Prisma.NodeTemplateCountOutputTypeDefaultArgs<ExtArgs>;
};
export type NodeTemplateIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type NodeTemplateIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $NodeTemplatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "NodeTemplate";
    objects: {
        nodes: Prisma.$NodePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        templateId: string;
        version: string;
        name: string;
        description: string | null;
        nodeType: $Enums.NodeType;
        shape: $Enums.NodeShape;
        handlesConfig: runtime.JsonValue;
        actionConfig: runtime.JsonValue | null;
        dynamicHandles: runtime.JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["nodeTemplate"]>;
    composites: {};
};
export type NodeTemplateGetPayload<S extends boolean | null | undefined | NodeTemplateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload, S>;
export type NodeTemplateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<NodeTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: NodeTemplateCountAggregateInputType | true;
};
export interface NodeTemplateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['NodeTemplate'];
        meta: {
            name: 'NodeTemplate';
        };
    };
    findUnique<T extends NodeTemplateFindUniqueArgs>(args: Prisma.SelectSubset<T, NodeTemplateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends NodeTemplateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, NodeTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends NodeTemplateFindFirstArgs>(args?: Prisma.SelectSubset<T, NodeTemplateFindFirstArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends NodeTemplateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, NodeTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends NodeTemplateFindManyArgs>(args?: Prisma.SelectSubset<T, NodeTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends NodeTemplateCreateArgs>(args: Prisma.SelectSubset<T, NodeTemplateCreateArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends NodeTemplateCreateManyArgs>(args?: Prisma.SelectSubset<T, NodeTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends NodeTemplateCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, NodeTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends NodeTemplateDeleteArgs>(args: Prisma.SelectSubset<T, NodeTemplateDeleteArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends NodeTemplateUpdateArgs>(args: Prisma.SelectSubset<T, NodeTemplateUpdateArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends NodeTemplateDeleteManyArgs>(args?: Prisma.SelectSubset<T, NodeTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends NodeTemplateUpdateManyArgs>(args: Prisma.SelectSubset<T, NodeTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends NodeTemplateUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, NodeTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends NodeTemplateUpsertArgs>(args: Prisma.SelectSubset<T, NodeTemplateUpsertArgs<ExtArgs>>): Prisma.Prisma__NodeTemplateClient<runtime.Types.Result.GetResult<Prisma.$NodeTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends NodeTemplateCountArgs>(args?: Prisma.Subset<T, NodeTemplateCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], NodeTemplateCountAggregateOutputType> : number>;
    aggregate<T extends NodeTemplateAggregateArgs>(args: Prisma.Subset<T, NodeTemplateAggregateArgs>): Prisma.PrismaPromise<GetNodeTemplateAggregateType<T>>;
    groupBy<T extends NodeTemplateGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: NodeTemplateGroupByArgs['orderBy'];
    } : {
        orderBy?: NodeTemplateGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, NodeTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNodeTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: NodeTemplateFieldRefs;
}
export interface Prisma__NodeTemplateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    nodes<T extends Prisma.NodeTemplate$nodesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.NodeTemplate$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface NodeTemplateFieldRefs {
    readonly id: Prisma.FieldRef<"NodeTemplate", 'String'>;
    readonly templateId: Prisma.FieldRef<"NodeTemplate", 'String'>;
    readonly version: Prisma.FieldRef<"NodeTemplate", 'String'>;
    readonly name: Prisma.FieldRef<"NodeTemplate", 'String'>;
    readonly description: Prisma.FieldRef<"NodeTemplate", 'String'>;
    readonly nodeType: Prisma.FieldRef<"NodeTemplate", 'NodeType'>;
    readonly shape: Prisma.FieldRef<"NodeTemplate", 'NodeShape'>;
    readonly handlesConfig: Prisma.FieldRef<"NodeTemplate", 'Json'>;
    readonly actionConfig: Prisma.FieldRef<"NodeTemplate", 'Json'>;
    readonly dynamicHandles: Prisma.FieldRef<"NodeTemplate", 'Json'>;
    readonly isActive: Prisma.FieldRef<"NodeTemplate", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"NodeTemplate", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"NodeTemplate", 'DateTime'>;
}
export type NodeTemplateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where: Prisma.NodeTemplateWhereUniqueInput;
};
export type NodeTemplateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where: Prisma.NodeTemplateWhereUniqueInput;
};
export type NodeTemplateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where?: Prisma.NodeTemplateWhereInput;
    orderBy?: Prisma.NodeTemplateOrderByWithRelationInput | Prisma.NodeTemplateOrderByWithRelationInput[];
    cursor?: Prisma.NodeTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeTemplateScalarFieldEnum | Prisma.NodeTemplateScalarFieldEnum[];
};
export type NodeTemplateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where?: Prisma.NodeTemplateWhereInput;
    orderBy?: Prisma.NodeTemplateOrderByWithRelationInput | Prisma.NodeTemplateOrderByWithRelationInput[];
    cursor?: Prisma.NodeTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeTemplateScalarFieldEnum | Prisma.NodeTemplateScalarFieldEnum[];
};
export type NodeTemplateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where?: Prisma.NodeTemplateWhereInput;
    orderBy?: Prisma.NodeTemplateOrderByWithRelationInput | Prisma.NodeTemplateOrderByWithRelationInput[];
    cursor?: Prisma.NodeTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeTemplateScalarFieldEnum | Prisma.NodeTemplateScalarFieldEnum[];
};
export type NodeTemplateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeTemplateCreateInput, Prisma.NodeTemplateUncheckedCreateInput>;
};
export type NodeTemplateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.NodeTemplateCreateManyInput | Prisma.NodeTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NodeTemplateCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    data: Prisma.NodeTemplateCreateManyInput | Prisma.NodeTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NodeTemplateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeTemplateUpdateInput, Prisma.NodeTemplateUncheckedUpdateInput>;
    where: Prisma.NodeTemplateWhereUniqueInput;
};
export type NodeTemplateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.NodeTemplateUpdateManyMutationInput, Prisma.NodeTemplateUncheckedUpdateManyInput>;
    where?: Prisma.NodeTemplateWhereInput;
    limit?: number;
};
export type NodeTemplateUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeTemplateUpdateManyMutationInput, Prisma.NodeTemplateUncheckedUpdateManyInput>;
    where?: Prisma.NodeTemplateWhereInput;
    limit?: number;
};
export type NodeTemplateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where: Prisma.NodeTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeTemplateCreateInput, Prisma.NodeTemplateUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.NodeTemplateUpdateInput, Prisma.NodeTemplateUncheckedUpdateInput>;
};
export type NodeTemplateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
    where: Prisma.NodeTemplateWhereUniqueInput;
};
export type NodeTemplateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeTemplateWhereInput;
    limit?: number;
};
export type NodeTemplate$nodesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeScalarFieldEnum | Prisma.NodeScalarFieldEnum[];
};
export type NodeTemplateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeTemplateSelect<ExtArgs> | null;
    omit?: Prisma.NodeTemplateOmit<ExtArgs> | null;
    include?: Prisma.NodeTemplateInclude<ExtArgs> | null;
};
export {};
