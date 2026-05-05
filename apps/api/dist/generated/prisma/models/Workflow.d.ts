import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WorkflowModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkflowPayload>;
export type AggregateWorkflow = {
    _count: WorkflowCountAggregateOutputType | null;
    _min: WorkflowMinAggregateOutputType | null;
    _max: WorkflowMaxAggregateOutputType | null;
};
export type WorkflowMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    status: $Enums.WorkflowStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkflowMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    status: $Enums.WorkflowStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkflowCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WorkflowMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkflowMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkflowCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WorkflowAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkflowWhereInput;
    orderBy?: Prisma.WorkflowOrderByWithRelationInput | Prisma.WorkflowOrderByWithRelationInput[];
    cursor?: Prisma.WorkflowWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkflowCountAggregateInputType;
    _min?: WorkflowMinAggregateInputType;
    _max?: WorkflowMaxAggregateInputType;
};
export type GetWorkflowAggregateType<T extends WorkflowAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkflow]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkflow[P]> : Prisma.GetScalarType<T[P], AggregateWorkflow[P]>;
};
export type WorkflowGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkflowWhereInput;
    orderBy?: Prisma.WorkflowOrderByWithAggregationInput | Prisma.WorkflowOrderByWithAggregationInput[];
    by: Prisma.WorkflowScalarFieldEnum[] | Prisma.WorkflowScalarFieldEnum;
    having?: Prisma.WorkflowScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkflowCountAggregateInputType | true;
    _min?: WorkflowMinAggregateInputType;
    _max?: WorkflowMaxAggregateInputType;
};
export type WorkflowGroupByOutputType = {
    id: string;
    name: string;
    description: string | null;
    status: $Enums.WorkflowStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: WorkflowCountAggregateOutputType | null;
    _min: WorkflowMinAggregateOutputType | null;
    _max: WorkflowMaxAggregateOutputType | null;
};
type GetWorkflowGroupByPayload<T extends WorkflowGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkflowGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkflowGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkflowGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkflowGroupByOutputType[P]>;
}>>;
export type WorkflowWhereInput = {
    AND?: Prisma.WorkflowWhereInput | Prisma.WorkflowWhereInput[];
    OR?: Prisma.WorkflowWhereInput[];
    NOT?: Prisma.WorkflowWhereInput | Prisma.WorkflowWhereInput[];
    id?: Prisma.StringFilter<"Workflow"> | string;
    name?: Prisma.StringFilter<"Workflow"> | string;
    description?: Prisma.StringNullableFilter<"Workflow"> | string | null;
    status?: Prisma.EnumWorkflowStatusFilter<"Workflow"> | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFilter<"Workflow"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workflow"> | Date | string;
    nodes?: Prisma.NodeListRelationFilter;
    edges?: Prisma.EdgeListRelationFilter;
};
export type WorkflowOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    nodes?: Prisma.NodeOrderByRelationAggregateInput;
    edges?: Prisma.EdgeOrderByRelationAggregateInput;
};
export type WorkflowWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WorkflowWhereInput | Prisma.WorkflowWhereInput[];
    OR?: Prisma.WorkflowWhereInput[];
    NOT?: Prisma.WorkflowWhereInput | Prisma.WorkflowWhereInput[];
    name?: Prisma.StringFilter<"Workflow"> | string;
    description?: Prisma.StringNullableFilter<"Workflow"> | string | null;
    status?: Prisma.EnumWorkflowStatusFilter<"Workflow"> | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFilter<"Workflow"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workflow"> | Date | string;
    nodes?: Prisma.NodeListRelationFilter;
    edges?: Prisma.EdgeListRelationFilter;
}, "id">;
export type WorkflowOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WorkflowCountOrderByAggregateInput;
    _max?: Prisma.WorkflowMaxOrderByAggregateInput;
    _min?: Prisma.WorkflowMinOrderByAggregateInput;
};
export type WorkflowScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkflowScalarWhereWithAggregatesInput | Prisma.WorkflowScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkflowScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkflowScalarWhereWithAggregatesInput | Prisma.WorkflowScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Workflow"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Workflow"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Workflow"> | string | null;
    status?: Prisma.EnumWorkflowStatusWithAggregatesFilter<"Workflow"> | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Workflow"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Workflow"> | Date | string;
};
export type WorkflowCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeCreateNestedManyWithoutWorkflowInput;
    edges?: Prisma.EdgeCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowUncheckedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeUncheckedCreateNestedManyWithoutWorkflowInput;
    edges?: Prisma.EdgeUncheckedCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUpdateManyWithoutWorkflowNestedInput;
    edges?: Prisma.EdgeUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUncheckedUpdateManyWithoutWorkflowNestedInput;
    edges?: Prisma.EdgeUncheckedUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowCreateManyInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkflowUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkflowUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkflowCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkflowMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkflowMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkflowScalarRelationFilter = {
    is?: Prisma.WorkflowWhereInput;
    isNot?: Prisma.WorkflowWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumWorkflowStatusFieldUpdateOperationsInput = {
    set?: $Enums.WorkflowStatus;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type WorkflowCreateNestedOneWithoutNodesInput = {
    create?: Prisma.XOR<Prisma.WorkflowCreateWithoutNodesInput, Prisma.WorkflowUncheckedCreateWithoutNodesInput>;
    connectOrCreate?: Prisma.WorkflowCreateOrConnectWithoutNodesInput;
    connect?: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowUpdateOneRequiredWithoutNodesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkflowCreateWithoutNodesInput, Prisma.WorkflowUncheckedCreateWithoutNodesInput>;
    connectOrCreate?: Prisma.WorkflowCreateOrConnectWithoutNodesInput;
    upsert?: Prisma.WorkflowUpsertWithoutNodesInput;
    connect?: Prisma.WorkflowWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkflowUpdateToOneWithWhereWithoutNodesInput, Prisma.WorkflowUpdateWithoutNodesInput>, Prisma.WorkflowUncheckedUpdateWithoutNodesInput>;
};
export type WorkflowCreateNestedOneWithoutEdgesInput = {
    create?: Prisma.XOR<Prisma.WorkflowCreateWithoutEdgesInput, Prisma.WorkflowUncheckedCreateWithoutEdgesInput>;
    connectOrCreate?: Prisma.WorkflowCreateOrConnectWithoutEdgesInput;
    connect?: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowUpdateOneRequiredWithoutEdgesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkflowCreateWithoutEdgesInput, Prisma.WorkflowUncheckedCreateWithoutEdgesInput>;
    connectOrCreate?: Prisma.WorkflowCreateOrConnectWithoutEdgesInput;
    upsert?: Prisma.WorkflowUpsertWithoutEdgesInput;
    connect?: Prisma.WorkflowWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkflowUpdateToOneWithWhereWithoutEdgesInput, Prisma.WorkflowUpdateWithoutEdgesInput>, Prisma.WorkflowUncheckedUpdateWithoutEdgesInput>;
};
export type WorkflowCreateWithoutNodesInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    edges?: Prisma.EdgeCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowUncheckedCreateWithoutNodesInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    edges?: Prisma.EdgeUncheckedCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowCreateOrConnectWithoutNodesInput = {
    where: Prisma.WorkflowWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkflowCreateWithoutNodesInput, Prisma.WorkflowUncheckedCreateWithoutNodesInput>;
};
export type WorkflowUpsertWithoutNodesInput = {
    update: Prisma.XOR<Prisma.WorkflowUpdateWithoutNodesInput, Prisma.WorkflowUncheckedUpdateWithoutNodesInput>;
    create: Prisma.XOR<Prisma.WorkflowCreateWithoutNodesInput, Prisma.WorkflowUncheckedCreateWithoutNodesInput>;
    where?: Prisma.WorkflowWhereInput;
};
export type WorkflowUpdateToOneWithWhereWithoutNodesInput = {
    where?: Prisma.WorkflowWhereInput;
    data: Prisma.XOR<Prisma.WorkflowUpdateWithoutNodesInput, Prisma.WorkflowUncheckedUpdateWithoutNodesInput>;
};
export type WorkflowUpdateWithoutNodesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    edges?: Prisma.EdgeUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowUncheckedUpdateWithoutNodesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    edges?: Prisma.EdgeUncheckedUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowCreateWithoutEdgesInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowUncheckedCreateWithoutEdgesInput = {
    id?: string;
    name: string;
    description?: string | null;
    status?: $Enums.WorkflowStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    nodes?: Prisma.NodeUncheckedCreateNestedManyWithoutWorkflowInput;
};
export type WorkflowCreateOrConnectWithoutEdgesInput = {
    where: Prisma.WorkflowWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkflowCreateWithoutEdgesInput, Prisma.WorkflowUncheckedCreateWithoutEdgesInput>;
};
export type WorkflowUpsertWithoutEdgesInput = {
    update: Prisma.XOR<Prisma.WorkflowUpdateWithoutEdgesInput, Prisma.WorkflowUncheckedUpdateWithoutEdgesInput>;
    create: Prisma.XOR<Prisma.WorkflowCreateWithoutEdgesInput, Prisma.WorkflowUncheckedCreateWithoutEdgesInput>;
    where?: Prisma.WorkflowWhereInput;
};
export type WorkflowUpdateToOneWithWhereWithoutEdgesInput = {
    where?: Prisma.WorkflowWhereInput;
    data: Prisma.XOR<Prisma.WorkflowUpdateWithoutEdgesInput, Prisma.WorkflowUncheckedUpdateWithoutEdgesInput>;
};
export type WorkflowUpdateWithoutEdgesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowUncheckedUpdateWithoutEdgesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    nodes?: Prisma.NodeUncheckedUpdateManyWithoutWorkflowNestedInput;
};
export type WorkflowCountOutputType = {
    nodes: number;
    edges: number;
};
export type WorkflowCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    nodes?: boolean | WorkflowCountOutputTypeCountNodesArgs;
    edges?: boolean | WorkflowCountOutputTypeCountEdgesArgs;
};
export type WorkflowCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowCountOutputTypeSelect<ExtArgs> | null;
};
export type WorkflowCountOutputTypeCountNodesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
};
export type WorkflowCountOutputTypeCountEdgesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EdgeWhereInput;
};
export type WorkflowSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    nodes?: boolean | Prisma.Workflow$nodesArgs<ExtArgs>;
    edges?: boolean | Prisma.Workflow$edgesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkflowCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workflow"]>;
export type WorkflowSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["workflow"]>;
export type WorkflowSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["workflow"]>;
export type WorkflowSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WorkflowOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["workflow"]>;
export type WorkflowInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    nodes?: boolean | Prisma.Workflow$nodesArgs<ExtArgs>;
    edges?: boolean | Prisma.Workflow$edgesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkflowCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WorkflowIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type WorkflowIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $WorkflowPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Workflow";
    objects: {
        nodes: Prisma.$NodePayload<ExtArgs>[];
        edges: Prisma.$EdgePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        description: string | null;
        status: $Enums.WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["workflow"]>;
    composites: {};
};
export type WorkflowGetPayload<S extends boolean | null | undefined | WorkflowDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkflowPayload, S>;
export type WorkflowCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkflowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkflowCountAggregateInputType | true;
};
export interface WorkflowDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Workflow'];
        meta: {
            name: 'Workflow';
        };
    };
    findUnique<T extends WorkflowFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkflowFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkflowFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkflowFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkflowFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkflowFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkflowFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkflowFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkflowFindManyArgs>(args?: Prisma.SelectSubset<T, WorkflowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkflowCreateArgs>(args: Prisma.SelectSubset<T, WorkflowCreateArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkflowCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkflowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkflowCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkflowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkflowDeleteArgs>(args: Prisma.SelectSubset<T, WorkflowDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkflowUpdateArgs>(args: Prisma.SelectSubset<T, WorkflowUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkflowDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkflowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkflowUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkflowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkflowUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkflowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkflowUpsertArgs>(args: Prisma.SelectSubset<T, WorkflowUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkflowClient<runtime.Types.Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkflowCountArgs>(args?: Prisma.Subset<T, WorkflowCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkflowCountAggregateOutputType> : number>;
    aggregate<T extends WorkflowAggregateArgs>(args: Prisma.Subset<T, WorkflowAggregateArgs>): Prisma.PrismaPromise<GetWorkflowAggregateType<T>>;
    groupBy<T extends WorkflowGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkflowGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkflowGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkflowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkflowFieldRefs;
}
export interface Prisma__WorkflowClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    nodes<T extends Prisma.Workflow$nodesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workflow$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    edges<T extends Prisma.Workflow$edgesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workflow$edgesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkflowFieldRefs {
    readonly id: Prisma.FieldRef<"Workflow", 'String'>;
    readonly name: Prisma.FieldRef<"Workflow", 'String'>;
    readonly description: Prisma.FieldRef<"Workflow", 'String'>;
    readonly status: Prisma.FieldRef<"Workflow", 'WorkflowStatus'>;
    readonly createdAt: Prisma.FieldRef<"Workflow", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Workflow", 'DateTime'>;
}
export type WorkflowFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where?: Prisma.WorkflowWhereInput;
    orderBy?: Prisma.WorkflowOrderByWithRelationInput | Prisma.WorkflowOrderByWithRelationInput[];
    cursor?: Prisma.WorkflowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkflowScalarFieldEnum | Prisma.WorkflowScalarFieldEnum[];
};
export type WorkflowFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where?: Prisma.WorkflowWhereInput;
    orderBy?: Prisma.WorkflowOrderByWithRelationInput | Prisma.WorkflowOrderByWithRelationInput[];
    cursor?: Prisma.WorkflowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkflowScalarFieldEnum | Prisma.WorkflowScalarFieldEnum[];
};
export type WorkflowFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where?: Prisma.WorkflowWhereInput;
    orderBy?: Prisma.WorkflowOrderByWithRelationInput | Prisma.WorkflowOrderByWithRelationInput[];
    cursor?: Prisma.WorkflowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkflowScalarFieldEnum | Prisma.WorkflowScalarFieldEnum[];
};
export type WorkflowCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkflowCreateInput, Prisma.WorkflowUncheckedCreateInput>;
};
export type WorkflowCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkflowCreateManyInput | Prisma.WorkflowCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkflowCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    data: Prisma.WorkflowCreateManyInput | Prisma.WorkflowCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkflowUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkflowUpdateInput, Prisma.WorkflowUncheckedUpdateInput>;
    where: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkflowUpdateManyMutationInput, Prisma.WorkflowUncheckedUpdateManyInput>;
    where?: Prisma.WorkflowWhereInput;
    limit?: number;
};
export type WorkflowUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkflowUpdateManyMutationInput, Prisma.WorkflowUncheckedUpdateManyInput>;
    where?: Prisma.WorkflowWhereInput;
    limit?: number;
};
export type WorkflowUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where: Prisma.WorkflowWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkflowCreateInput, Prisma.WorkflowUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkflowUpdateInput, Prisma.WorkflowUncheckedUpdateInput>;
};
export type WorkflowDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
    where: Prisma.WorkflowWhereUniqueInput;
};
export type WorkflowDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkflowWhereInput;
    limit?: number;
};
export type Workflow$nodesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Workflow$edgesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkflowDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkflowSelect<ExtArgs> | null;
    omit?: Prisma.WorkflowOmit<ExtArgs> | null;
    include?: Prisma.WorkflowInclude<ExtArgs> | null;
};
export {};
