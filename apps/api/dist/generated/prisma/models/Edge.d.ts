import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EdgeModel = runtime.Types.Result.DefaultSelection<Prisma.$EdgePayload>;
export type AggregateEdge = {
    _count: EdgeCountAggregateOutputType | null;
    _min: EdgeMinAggregateOutputType | null;
    _max: EdgeMaxAggregateOutputType | null;
};
export type EdgeMinAggregateOutputType = {
    id: string | null;
    workflowId: string | null;
    sourceNodeId: string | null;
    targetNodeId: string | null;
    sourceHandle: string | null;
    targetHandle: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EdgeMaxAggregateOutputType = {
    id: string | null;
    workflowId: string | null;
    sourceNodeId: string | null;
    targetNodeId: string | null;
    sourceHandle: string | null;
    targetHandle: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EdgeCountAggregateOutputType = {
    id: number;
    workflowId: number;
    sourceNodeId: number;
    targetNodeId: number;
    sourceHandle: number;
    targetHandle: number;
    meta: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EdgeMinAggregateInputType = {
    id?: true;
    workflowId?: true;
    sourceNodeId?: true;
    targetNodeId?: true;
    sourceHandle?: true;
    targetHandle?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EdgeMaxAggregateInputType = {
    id?: true;
    workflowId?: true;
    sourceNodeId?: true;
    targetNodeId?: true;
    sourceHandle?: true;
    targetHandle?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EdgeCountAggregateInputType = {
    id?: true;
    workflowId?: true;
    sourceNodeId?: true;
    targetNodeId?: true;
    sourceHandle?: true;
    targetHandle?: true;
    meta?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EdgeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdgeWhereInput;
    orderBy?: Prisma.EdgeOrderByWithRelationInput | Prisma.EdgeOrderByWithRelationInput[];
    cursor?: Prisma.EdgeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EdgeCountAggregateInputType;
    _min?: EdgeMinAggregateInputType;
    _max?: EdgeMaxAggregateInputType;
};
export type GetEdgeAggregateType<T extends EdgeAggregateArgs> = {
    [P in keyof T & keyof AggregateEdge]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEdge[P]> : Prisma.GetScalarType<T[P], AggregateEdge[P]>;
};
export type EdgeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdgeWhereInput;
    orderBy?: Prisma.EdgeOrderByWithAggregationInput | Prisma.EdgeOrderByWithAggregationInput[];
    by: Prisma.EdgeScalarFieldEnum[] | Prisma.EdgeScalarFieldEnum;
    having?: Prisma.EdgeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EdgeCountAggregateInputType | true;
    _min?: EdgeMinAggregateInputType;
    _max?: EdgeMaxAggregateInputType;
};
export type EdgeGroupByOutputType = {
    id: string;
    workflowId: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle: string | null;
    targetHandle: string | null;
    meta: runtime.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    _count: EdgeCountAggregateOutputType | null;
    _min: EdgeMinAggregateOutputType | null;
    _max: EdgeMaxAggregateOutputType | null;
};
type GetEdgeGroupByPayload<T extends EdgeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EdgeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EdgeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EdgeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EdgeGroupByOutputType[P]>;
}>>;
export type EdgeWhereInput = {
    AND?: Prisma.EdgeWhereInput | Prisma.EdgeWhereInput[];
    OR?: Prisma.EdgeWhereInput[];
    NOT?: Prisma.EdgeWhereInput | Prisma.EdgeWhereInput[];
    id?: Prisma.StringFilter<"Edge"> | string;
    workflowId?: Prisma.StringFilter<"Edge"> | string;
    sourceNodeId?: Prisma.StringFilter<"Edge"> | string;
    targetNodeId?: Prisma.StringFilter<"Edge"> | string;
    sourceHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    targetHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    meta?: Prisma.JsonNullableFilter<"Edge">;
    createdAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
    workflow?: Prisma.XOR<Prisma.WorkflowScalarRelationFilter, Prisma.WorkflowWhereInput>;
    sourceNode?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
    targetNode?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
};
export type EdgeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workflowId?: Prisma.SortOrder;
    sourceNodeId?: Prisma.SortOrder;
    targetNodeId?: Prisma.SortOrder;
    sourceHandle?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetHandle?: Prisma.SortOrderInput | Prisma.SortOrder;
    meta?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workflow?: Prisma.WorkflowOrderByWithRelationInput;
    sourceNode?: Prisma.NodeOrderByWithRelationInput;
    targetNode?: Prisma.NodeOrderByWithRelationInput;
};
export type EdgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EdgeWhereInput | Prisma.EdgeWhereInput[];
    OR?: Prisma.EdgeWhereInput[];
    NOT?: Prisma.EdgeWhereInput | Prisma.EdgeWhereInput[];
    workflowId?: Prisma.StringFilter<"Edge"> | string;
    sourceNodeId?: Prisma.StringFilter<"Edge"> | string;
    targetNodeId?: Prisma.StringFilter<"Edge"> | string;
    sourceHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    targetHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    meta?: Prisma.JsonNullableFilter<"Edge">;
    createdAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
    workflow?: Prisma.XOR<Prisma.WorkflowScalarRelationFilter, Prisma.WorkflowWhereInput>;
    sourceNode?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
    targetNode?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
}, "id">;
export type EdgeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workflowId?: Prisma.SortOrder;
    sourceNodeId?: Prisma.SortOrder;
    targetNodeId?: Prisma.SortOrder;
    sourceHandle?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetHandle?: Prisma.SortOrderInput | Prisma.SortOrder;
    meta?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EdgeCountOrderByAggregateInput;
    _max?: Prisma.EdgeMaxOrderByAggregateInput;
    _min?: Prisma.EdgeMinOrderByAggregateInput;
};
export type EdgeScalarWhereWithAggregatesInput = {
    AND?: Prisma.EdgeScalarWhereWithAggregatesInput | Prisma.EdgeScalarWhereWithAggregatesInput[];
    OR?: Prisma.EdgeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EdgeScalarWhereWithAggregatesInput | Prisma.EdgeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Edge"> | string;
    workflowId?: Prisma.StringWithAggregatesFilter<"Edge"> | string;
    sourceNodeId?: Prisma.StringWithAggregatesFilter<"Edge"> | string;
    targetNodeId?: Prisma.StringWithAggregatesFilter<"Edge"> | string;
    sourceHandle?: Prisma.StringNullableWithAggregatesFilter<"Edge"> | string | null;
    targetHandle?: Prisma.StringNullableWithAggregatesFilter<"Edge"> | string | null;
    meta?: Prisma.JsonNullableWithAggregatesFilter<"Edge">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Edge"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Edge"> | Date | string;
};
export type EdgeCreateInput = {
    id?: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workflow: Prisma.WorkflowCreateNestedOneWithoutEdgesInput;
    sourceNode: Prisma.NodeCreateNestedOneWithoutOutgoingEdgesInput;
    targetNode: Prisma.NodeCreateNestedOneWithoutIncomingEdgesInput;
};
export type EdgeUncheckedCreateInput = {
    id?: string;
    workflowId: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workflow?: Prisma.WorkflowUpdateOneRequiredWithoutEdgesNestedInput;
    sourceNode?: Prisma.NodeUpdateOneRequiredWithoutOutgoingEdgesNestedInput;
    targetNode?: Prisma.NodeUpdateOneRequiredWithoutIncomingEdgesNestedInput;
};
export type EdgeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeCreateManyInput = {
    id?: string;
    workflowId: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeListRelationFilter = {
    every?: Prisma.EdgeWhereInput;
    some?: Prisma.EdgeWhereInput;
    none?: Prisma.EdgeWhereInput;
};
export type EdgeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EdgeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workflowId?: Prisma.SortOrder;
    sourceNodeId?: Prisma.SortOrder;
    targetNodeId?: Prisma.SortOrder;
    sourceHandle?: Prisma.SortOrder;
    targetHandle?: Prisma.SortOrder;
    meta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdgeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workflowId?: Prisma.SortOrder;
    sourceNodeId?: Prisma.SortOrder;
    targetNodeId?: Prisma.SortOrder;
    sourceHandle?: Prisma.SortOrder;
    targetHandle?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdgeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workflowId?: Prisma.SortOrder;
    sourceNodeId?: Prisma.SortOrder;
    targetNodeId?: Prisma.SortOrder;
    sourceHandle?: Prisma.SortOrder;
    targetHandle?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EdgeCreateNestedManyWithoutWorkflowInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput> | Prisma.EdgeCreateWithoutWorkflowInput[] | Prisma.EdgeUncheckedCreateWithoutWorkflowInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutWorkflowInput | Prisma.EdgeCreateOrConnectWithoutWorkflowInput[];
    createMany?: Prisma.EdgeCreateManyWorkflowInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput> | Prisma.EdgeCreateWithoutWorkflowInput[] | Prisma.EdgeUncheckedCreateWithoutWorkflowInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutWorkflowInput | Prisma.EdgeCreateOrConnectWithoutWorkflowInput[];
    createMany?: Prisma.EdgeCreateManyWorkflowInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeUpdateManyWithoutWorkflowNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput> | Prisma.EdgeCreateWithoutWorkflowInput[] | Prisma.EdgeUncheckedCreateWithoutWorkflowInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutWorkflowInput | Prisma.EdgeCreateOrConnectWithoutWorkflowInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutWorkflowInput | Prisma.EdgeUpsertWithWhereUniqueWithoutWorkflowInput[];
    createMany?: Prisma.EdgeCreateManyWorkflowInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutWorkflowInput | Prisma.EdgeUpdateWithWhereUniqueWithoutWorkflowInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutWorkflowInput | Prisma.EdgeUpdateManyWithWhereWithoutWorkflowInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput> | Prisma.EdgeCreateWithoutWorkflowInput[] | Prisma.EdgeUncheckedCreateWithoutWorkflowInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutWorkflowInput | Prisma.EdgeCreateOrConnectWithoutWorkflowInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutWorkflowInput | Prisma.EdgeUpsertWithWhereUniqueWithoutWorkflowInput[];
    createMany?: Prisma.EdgeCreateManyWorkflowInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutWorkflowInput | Prisma.EdgeUpdateWithWhereUniqueWithoutWorkflowInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutWorkflowInput | Prisma.EdgeUpdateManyWithWhereWithoutWorkflowInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeCreateNestedManyWithoutSourceNodeInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput> | Prisma.EdgeCreateWithoutSourceNodeInput[] | Prisma.EdgeUncheckedCreateWithoutSourceNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutSourceNodeInput | Prisma.EdgeCreateOrConnectWithoutSourceNodeInput[];
    createMany?: Prisma.EdgeCreateManySourceNodeInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeCreateNestedManyWithoutTargetNodeInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput> | Prisma.EdgeCreateWithoutTargetNodeInput[] | Prisma.EdgeUncheckedCreateWithoutTargetNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutTargetNodeInput | Prisma.EdgeCreateOrConnectWithoutTargetNodeInput[];
    createMany?: Prisma.EdgeCreateManyTargetNodeInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeUncheckedCreateNestedManyWithoutSourceNodeInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput> | Prisma.EdgeCreateWithoutSourceNodeInput[] | Prisma.EdgeUncheckedCreateWithoutSourceNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutSourceNodeInput | Prisma.EdgeCreateOrConnectWithoutSourceNodeInput[];
    createMany?: Prisma.EdgeCreateManySourceNodeInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeUncheckedCreateNestedManyWithoutTargetNodeInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput> | Prisma.EdgeCreateWithoutTargetNodeInput[] | Prisma.EdgeUncheckedCreateWithoutTargetNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutTargetNodeInput | Prisma.EdgeCreateOrConnectWithoutTargetNodeInput[];
    createMany?: Prisma.EdgeCreateManyTargetNodeInputEnvelope;
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
};
export type EdgeUpdateManyWithoutSourceNodeNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput> | Prisma.EdgeCreateWithoutSourceNodeInput[] | Prisma.EdgeUncheckedCreateWithoutSourceNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutSourceNodeInput | Prisma.EdgeCreateOrConnectWithoutSourceNodeInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutSourceNodeInput | Prisma.EdgeUpsertWithWhereUniqueWithoutSourceNodeInput[];
    createMany?: Prisma.EdgeCreateManySourceNodeInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutSourceNodeInput | Prisma.EdgeUpdateWithWhereUniqueWithoutSourceNodeInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutSourceNodeInput | Prisma.EdgeUpdateManyWithWhereWithoutSourceNodeInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeUpdateManyWithoutTargetNodeNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput> | Prisma.EdgeCreateWithoutTargetNodeInput[] | Prisma.EdgeUncheckedCreateWithoutTargetNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutTargetNodeInput | Prisma.EdgeCreateOrConnectWithoutTargetNodeInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutTargetNodeInput | Prisma.EdgeUpsertWithWhereUniqueWithoutTargetNodeInput[];
    createMany?: Prisma.EdgeCreateManyTargetNodeInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutTargetNodeInput | Prisma.EdgeUpdateWithWhereUniqueWithoutTargetNodeInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutTargetNodeInput | Prisma.EdgeUpdateManyWithWhereWithoutTargetNodeInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeUncheckedUpdateManyWithoutSourceNodeNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput> | Prisma.EdgeCreateWithoutSourceNodeInput[] | Prisma.EdgeUncheckedCreateWithoutSourceNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutSourceNodeInput | Prisma.EdgeCreateOrConnectWithoutSourceNodeInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutSourceNodeInput | Prisma.EdgeUpsertWithWhereUniqueWithoutSourceNodeInput[];
    createMany?: Prisma.EdgeCreateManySourceNodeInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutSourceNodeInput | Prisma.EdgeUpdateWithWhereUniqueWithoutSourceNodeInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutSourceNodeInput | Prisma.EdgeUpdateManyWithWhereWithoutSourceNodeInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeUncheckedUpdateManyWithoutTargetNodeNestedInput = {
    create?: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput> | Prisma.EdgeCreateWithoutTargetNodeInput[] | Prisma.EdgeUncheckedCreateWithoutTargetNodeInput[];
    connectOrCreate?: Prisma.EdgeCreateOrConnectWithoutTargetNodeInput | Prisma.EdgeCreateOrConnectWithoutTargetNodeInput[];
    upsert?: Prisma.EdgeUpsertWithWhereUniqueWithoutTargetNodeInput | Prisma.EdgeUpsertWithWhereUniqueWithoutTargetNodeInput[];
    createMany?: Prisma.EdgeCreateManyTargetNodeInputEnvelope;
    set?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    disconnect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    delete?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    connect?: Prisma.EdgeWhereUniqueInput | Prisma.EdgeWhereUniqueInput[];
    update?: Prisma.EdgeUpdateWithWhereUniqueWithoutTargetNodeInput | Prisma.EdgeUpdateWithWhereUniqueWithoutTargetNodeInput[];
    updateMany?: Prisma.EdgeUpdateManyWithWhereWithoutTargetNodeInput | Prisma.EdgeUpdateManyWithWhereWithoutTargetNodeInput[];
    deleteMany?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
};
export type EdgeCreateWithoutWorkflowInput = {
    id?: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sourceNode: Prisma.NodeCreateNestedOneWithoutOutgoingEdgesInput;
    targetNode: Prisma.NodeCreateNestedOneWithoutIncomingEdgesInput;
};
export type EdgeUncheckedCreateWithoutWorkflowInput = {
    id?: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeCreateOrConnectWithoutWorkflowInput = {
    where: Prisma.EdgeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput>;
};
export type EdgeCreateManyWorkflowInputEnvelope = {
    data: Prisma.EdgeCreateManyWorkflowInput | Prisma.EdgeCreateManyWorkflowInput[];
    skipDuplicates?: boolean;
};
export type EdgeUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: Prisma.EdgeWhereUniqueInput;
    update: Prisma.XOR<Prisma.EdgeUpdateWithoutWorkflowInput, Prisma.EdgeUncheckedUpdateWithoutWorkflowInput>;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutWorkflowInput, Prisma.EdgeUncheckedCreateWithoutWorkflowInput>;
};
export type EdgeUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: Prisma.EdgeWhereUniqueInput;
    data: Prisma.XOR<Prisma.EdgeUpdateWithoutWorkflowInput, Prisma.EdgeUncheckedUpdateWithoutWorkflowInput>;
};
export type EdgeUpdateManyWithWhereWithoutWorkflowInput = {
    where: Prisma.EdgeScalarWhereInput;
    data: Prisma.XOR<Prisma.EdgeUpdateManyMutationInput, Prisma.EdgeUncheckedUpdateManyWithoutWorkflowInput>;
};
export type EdgeScalarWhereInput = {
    AND?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
    OR?: Prisma.EdgeScalarWhereInput[];
    NOT?: Prisma.EdgeScalarWhereInput | Prisma.EdgeScalarWhereInput[];
    id?: Prisma.StringFilter<"Edge"> | string;
    workflowId?: Prisma.StringFilter<"Edge"> | string;
    sourceNodeId?: Prisma.StringFilter<"Edge"> | string;
    targetNodeId?: Prisma.StringFilter<"Edge"> | string;
    sourceHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    targetHandle?: Prisma.StringNullableFilter<"Edge"> | string | null;
    meta?: Prisma.JsonNullableFilter<"Edge">;
    createdAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Edge"> | Date | string;
};
export type EdgeCreateWithoutSourceNodeInput = {
    id?: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workflow: Prisma.WorkflowCreateNestedOneWithoutEdgesInput;
    targetNode: Prisma.NodeCreateNestedOneWithoutIncomingEdgesInput;
};
export type EdgeUncheckedCreateWithoutSourceNodeInput = {
    id?: string;
    workflowId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeCreateOrConnectWithoutSourceNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput>;
};
export type EdgeCreateManySourceNodeInputEnvelope = {
    data: Prisma.EdgeCreateManySourceNodeInput | Prisma.EdgeCreateManySourceNodeInput[];
    skipDuplicates?: boolean;
};
export type EdgeCreateWithoutTargetNodeInput = {
    id?: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workflow: Prisma.WorkflowCreateNestedOneWithoutEdgesInput;
    sourceNode: Prisma.NodeCreateNestedOneWithoutOutgoingEdgesInput;
};
export type EdgeUncheckedCreateWithoutTargetNodeInput = {
    id?: string;
    workflowId: string;
    sourceNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeCreateOrConnectWithoutTargetNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput>;
};
export type EdgeCreateManyTargetNodeInputEnvelope = {
    data: Prisma.EdgeCreateManyTargetNodeInput | Prisma.EdgeCreateManyTargetNodeInput[];
    skipDuplicates?: boolean;
};
export type EdgeUpsertWithWhereUniqueWithoutSourceNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    update: Prisma.XOR<Prisma.EdgeUpdateWithoutSourceNodeInput, Prisma.EdgeUncheckedUpdateWithoutSourceNodeInput>;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutSourceNodeInput, Prisma.EdgeUncheckedCreateWithoutSourceNodeInput>;
};
export type EdgeUpdateWithWhereUniqueWithoutSourceNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    data: Prisma.XOR<Prisma.EdgeUpdateWithoutSourceNodeInput, Prisma.EdgeUncheckedUpdateWithoutSourceNodeInput>;
};
export type EdgeUpdateManyWithWhereWithoutSourceNodeInput = {
    where: Prisma.EdgeScalarWhereInput;
    data: Prisma.XOR<Prisma.EdgeUpdateManyMutationInput, Prisma.EdgeUncheckedUpdateManyWithoutSourceNodeInput>;
};
export type EdgeUpsertWithWhereUniqueWithoutTargetNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    update: Prisma.XOR<Prisma.EdgeUpdateWithoutTargetNodeInput, Prisma.EdgeUncheckedUpdateWithoutTargetNodeInput>;
    create: Prisma.XOR<Prisma.EdgeCreateWithoutTargetNodeInput, Prisma.EdgeUncheckedCreateWithoutTargetNodeInput>;
};
export type EdgeUpdateWithWhereUniqueWithoutTargetNodeInput = {
    where: Prisma.EdgeWhereUniqueInput;
    data: Prisma.XOR<Prisma.EdgeUpdateWithoutTargetNodeInput, Prisma.EdgeUncheckedUpdateWithoutTargetNodeInput>;
};
export type EdgeUpdateManyWithWhereWithoutTargetNodeInput = {
    where: Prisma.EdgeScalarWhereInput;
    data: Prisma.XOR<Prisma.EdgeUpdateManyMutationInput, Prisma.EdgeUncheckedUpdateManyWithoutTargetNodeInput>;
};
export type EdgeCreateManyWorkflowInput = {
    id?: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeUpdateWithoutWorkflowInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceNode?: Prisma.NodeUpdateOneRequiredWithoutOutgoingEdgesNestedInput;
    targetNode?: Prisma.NodeUpdateOneRequiredWithoutIncomingEdgesNestedInput;
};
export type EdgeUncheckedUpdateWithoutWorkflowInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeUncheckedUpdateManyWithoutWorkflowInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeCreateManySourceNodeInput = {
    id?: string;
    workflowId: string;
    targetNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeCreateManyTargetNodeInput = {
    id?: string;
    workflowId: string;
    sourceNodeId: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EdgeUpdateWithoutSourceNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workflow?: Prisma.WorkflowUpdateOneRequiredWithoutEdgesNestedInput;
    targetNode?: Prisma.NodeUpdateOneRequiredWithoutIncomingEdgesNestedInput;
};
export type EdgeUncheckedUpdateWithoutSourceNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeUncheckedUpdateManyWithoutSourceNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeUpdateWithoutTargetNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workflow?: Prisma.WorkflowUpdateOneRequiredWithoutEdgesNestedInput;
    sourceNode?: Prisma.NodeUpdateOneRequiredWithoutOutgoingEdgesNestedInput;
};
export type EdgeUncheckedUpdateWithoutTargetNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeUncheckedUpdateManyWithoutTargetNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workflowId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceNodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetHandle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EdgeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workflowId?: boolean;
    sourceNodeId?: boolean;
    targetNodeId?: boolean;
    sourceHandle?: boolean;
    targetHandle?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["edge"]>;
export type EdgeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workflowId?: boolean;
    sourceNodeId?: boolean;
    targetNodeId?: boolean;
    sourceHandle?: boolean;
    targetHandle?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["edge"]>;
export type EdgeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workflowId?: boolean;
    sourceNodeId?: boolean;
    targetNodeId?: boolean;
    sourceHandle?: boolean;
    targetHandle?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["edge"]>;
export type EdgeSelectScalar = {
    id?: boolean;
    workflowId?: boolean;
    sourceNodeId?: boolean;
    targetNodeId?: boolean;
    sourceHandle?: boolean;
    targetHandle?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EdgeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workflowId" | "sourceNodeId" | "targetNodeId" | "sourceHandle" | "targetHandle" | "meta" | "createdAt" | "updatedAt", ExtArgs["result"]["edge"]>;
export type EdgeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type EdgeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type EdgeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workflow?: boolean | Prisma.WorkflowDefaultArgs<ExtArgs>;
    sourceNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    targetNode?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type $EdgePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Edge";
    objects: {
        workflow: Prisma.$WorkflowPayload<ExtArgs>;
        sourceNode: Prisma.$NodePayload<ExtArgs>;
        targetNode: Prisma.$NodePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workflowId: string;
        sourceNodeId: string;
        targetNodeId: string;
        sourceHandle: string | null;
        targetHandle: string | null;
        meta: runtime.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["edge"]>;
    composites: {};
};
export type EdgeGetPayload<S extends boolean | null | undefined | EdgeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EdgePayload, S>;
export type EdgeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EdgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EdgeCountAggregateInputType | true;
};
export interface EdgeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Edge'];
        meta: {
            name: 'Edge';
        };
    };
    findUnique<T extends EdgeFindUniqueArgs>(args: Prisma.SelectSubset<T, EdgeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EdgeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EdgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EdgeFindFirstArgs>(args?: Prisma.SelectSubset<T, EdgeFindFirstArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EdgeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EdgeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EdgeFindManyArgs>(args?: Prisma.SelectSubset<T, EdgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EdgeCreateArgs>(args: Prisma.SelectSubset<T, EdgeCreateArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EdgeCreateManyArgs>(args?: Prisma.SelectSubset<T, EdgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EdgeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EdgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EdgeDeleteArgs>(args: Prisma.SelectSubset<T, EdgeDeleteArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EdgeUpdateArgs>(args: Prisma.SelectSubset<T, EdgeUpdateArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EdgeDeleteManyArgs>(args?: Prisma.SelectSubset<T, EdgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EdgeUpdateManyArgs>(args: Prisma.SelectSubset<T, EdgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EdgeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EdgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EdgeUpsertArgs>(args: Prisma.SelectSubset<T, EdgeUpsertArgs<ExtArgs>>): Prisma.Prisma__EdgeClient<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EdgeCountArgs>(args?: Prisma.Subset<T, EdgeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EdgeCountAggregateOutputType> : number>;
    aggregate<T extends EdgeAggregateArgs>(args: Prisma.Subset<T, EdgeAggregateArgs>): Prisma.PrismaPromise<GetEdgeAggregateType<T>>;
    groupBy<T extends EdgeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EdgeGroupByArgs['orderBy'];
    } : {
        orderBy?: EdgeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EdgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEdgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EdgeFieldRefs;
}
export interface Prisma__EdgeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workflow<T extends Prisma.WorkflowDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkflowDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sourceNode<T extends Prisma.NodeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.NodeDefaultArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    targetNode<T extends Prisma.NodeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.NodeDefaultArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EdgeFieldRefs {
    readonly id: Prisma.FieldRef<"Edge", 'String'>;
    readonly workflowId: Prisma.FieldRef<"Edge", 'String'>;
    readonly sourceNodeId: Prisma.FieldRef<"Edge", 'String'>;
    readonly targetNodeId: Prisma.FieldRef<"Edge", 'String'>;
    readonly sourceHandle: Prisma.FieldRef<"Edge", 'String'>;
    readonly targetHandle: Prisma.FieldRef<"Edge", 'String'>;
    readonly meta: Prisma.FieldRef<"Edge", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"Edge", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Edge", 'DateTime'>;
}
export type EdgeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where: Prisma.EdgeWhereUniqueInput;
};
export type EdgeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where: Prisma.EdgeWhereUniqueInput;
};
export type EdgeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where?: Prisma.EdgeWhereInput;
    orderBy?: Prisma.EdgeOrderByWithRelationInput | Prisma.EdgeOrderByWithRelationInput[];
    cursor?: Prisma.EdgeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdgeScalarFieldEnum | Prisma.EdgeScalarFieldEnum[];
};
export type EdgeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where?: Prisma.EdgeWhereInput;
    orderBy?: Prisma.EdgeOrderByWithRelationInput | Prisma.EdgeOrderByWithRelationInput[];
    cursor?: Prisma.EdgeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdgeScalarFieldEnum | Prisma.EdgeScalarFieldEnum[];
};
export type EdgeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where?: Prisma.EdgeWhereInput;
    orderBy?: Prisma.EdgeOrderByWithRelationInput | Prisma.EdgeOrderByWithRelationInput[];
    cursor?: Prisma.EdgeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EdgeScalarFieldEnum | Prisma.EdgeScalarFieldEnum[];
};
export type EdgeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdgeCreateInput, Prisma.EdgeUncheckedCreateInput>;
};
export type EdgeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EdgeCreateManyInput | Prisma.EdgeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EdgeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    data: Prisma.EdgeCreateManyInput | Prisma.EdgeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EdgeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EdgeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdgeUpdateInput, Prisma.EdgeUncheckedUpdateInput>;
    where: Prisma.EdgeWhereUniqueInput;
};
export type EdgeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EdgeUpdateManyMutationInput, Prisma.EdgeUncheckedUpdateManyInput>;
    where?: Prisma.EdgeWhereInput;
    limit?: number;
};
export type EdgeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EdgeUpdateManyMutationInput, Prisma.EdgeUncheckedUpdateManyInput>;
    where?: Prisma.EdgeWhereInput;
    limit?: number;
    include?: Prisma.EdgeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EdgeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where: Prisma.EdgeWhereUniqueInput;
    create: Prisma.XOR<Prisma.EdgeCreateInput, Prisma.EdgeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EdgeUpdateInput, Prisma.EdgeUncheckedUpdateInput>;
};
export type EdgeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
    where: Prisma.EdgeWhereUniqueInput;
};
export type EdgeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdgeWhereInput;
    limit?: number;
};
export type EdgeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EdgeSelect<ExtArgs> | null;
    omit?: Prisma.EdgeOmit<ExtArgs> | null;
    include?: Prisma.EdgeInclude<ExtArgs> | null;
};
export {};
