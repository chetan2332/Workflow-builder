import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditorTopBar } from '../features/workflow-editor/EditorTopBar';
import { NodeLibraryDrawer } from '../features/workflow-editor/NodeLibraryDrawer';
import { Canvas } from '../features/workflow-editor/Canvas';
import type { NodeDefinitionId } from '../nodeTemplates';
import { NODE_DEFINITIONS_BY_ID } from '../nodeTemplates';
import { NodeActionDialog } from '../features/workflow-editor/NodeActionDialog';
import { getUnsatisfiedNodeIds } from '../features/workflow-editor/workflowValidation';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import { nanoid } from 'nanoid';

type WorkflowNodeData = {
  label?: string;
  definitionId: NodeDefinitionId;
  actionState?: Record<string, unknown>;
};

export function WorkflowEditorPage() {
  const { id } = useParams<{id: string}>();
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(true);

  const logWorkflow = () => {
    const workflow = {
      nodes,
      edges,
      loggedAt: new Date().toISOString(),
    };
    console.log('Workflow', workflow);
  };

  const handleSave = () => {
    logWorkflow();
    // TODO later: serialize canvas state and send to backend
  };

  const handleRun = () => {
    logWorkflow();
    // TODO later: call run endpoint
  };

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const [activeActionNodeId, setActiveActionNodeId] = useState<string | null>(
    null,
  );

  const handleAddNodeAtPosition = (
    definitionId: NodeDefinitionId,
    position: { x: number; y: number },
  ) => {
    const idStr = nanoid();
    const definition = NODE_DEFINITIONS_BY_ID[definitionId];
    const label = definition?.name ?? definitionId;

    setNodes((nds) => [
      ...nds,
      {
        id: idStr,
        type:
          definition?.shape === 'oppositeD'
            ? 'oppositeD'
            : definition?.shape === 'roundedRectangle'
            ? 'roundedRectangle'
            : 'circle',
        position,
        data: {
          label,
          definitionId,
          actionState: {},
        },
      },
    ]);
  };

  const unsatisfiedNodeIds = useMemo(
    () => getUnsatisfiedNodeIds(nodes, edges),
    [nodes, edges],
  );

  const activeNode = activeActionNodeId
    ? nodes.find((n) => n.id === activeActionNodeId)
    : undefined;
  const activeTemplate =
    activeNode && (activeNode.data as WorkflowNodeData | undefined)?.definitionId
      ? NODE_DEFINITIONS_BY_ID[(activeNode.data as WorkflowNodeData).definitionId]
      : undefined;

  return (
    <div className="flex flex-col h-screen">
      <EditorTopBar
        workflowId={id}
        workflowName={undefined}
        status="DRAFT"
        onSave={handleSave}
        onRun={handleRun}
        isSaving={false}
        isRunning={false}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Node library drawer (left) */}
        <div className="relative h-full min-h-0">
          <NodeLibraryDrawer
            isOpen={isNodeLibraryOpen}
            onToggle={() => setIsNodeLibraryOpen((v) => !v)}
          />
        </div>

        {/* Canvas area (right) */}
        <div className="flex-1 min-h-0 flex flex-col">
          {unsatisfiedNodeIds.size > 0 && (
            <div className="shrink-0 px-4 py-1.5 bg-amber-950/80 border-b border-amber-700/50 text-amber-200 text-xs">
              Workflow validation: {unsatisfiedNodeIds.size} node(s) have missing connections (every input and output must be connected).
            </div>
          )}
          <div className="flex-1 min-h-0">
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={(node) => setActiveActionNodeId(node.id)}
            onAddNodeAtPosition={handleAddNodeAtPosition}
            unsatisfiedNodeIds={unsatisfiedNodeIds}
          />
          </div>
        </div>
      </div>

      {activeNode && activeTemplate && activeTemplate.action && (
        <NodeActionDialog
          key={activeNode.id}
          template={activeTemplate}
          node={activeNode}
          isOpen={true}
          onClose={() => setActiveActionNodeId(null)}
          onSubmit={(nextState) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === activeNode.id
                  ? {
                      ...n,
                      data: {
                        ...(n.data as WorkflowNodeData),
                        actionState: nextState,
                      },
                    }
                  : n,
              ),
            );
          }}
        />
      )}
    </div>
  );
}