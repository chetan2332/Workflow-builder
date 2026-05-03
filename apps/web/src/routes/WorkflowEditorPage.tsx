import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { EditorTopBar } from '../features/workflow-editor/EditorTopBar';
import { NodeLibraryDrawer } from '../features/workflow-editor/NodeLibraryDrawer';
import { Canvas } from '../features/workflow-editor/Canvas';
import type { NodeDefinitionId } from '../nodeTemplates';
import { NODE_DEFINITIONS_BY_ID } from '../nodeTemplates';
import { NodeActionDialog } from '../features/workflow-editor/NodeActionDialog';
import { NodePickerModal } from '../features/workflow-editor/NodePickerModal';
import { getUnsatisfiedNodeIds } from '../features/workflow-editor/workflowValidation';
import { useDummyNodes } from '../features/workflow-editor/useDummyNodes';
import { useWorkflow, useUpdateWorkflow } from '../hooks/useWorkflow';
import { backendToXYFlow, xyFlowToBackend } from '../utils/workflowTransform';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { WorkflowNodeData } from '../nodeConfigSchema';

export function WorkflowEditorPage() {
  const { id } = useParams<{id: string}>();
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(true);

  // Load workflow from backend
  const { data: workflow, isLoading, error } = useWorkflow(id);
  const updateMutation = useUpdateWorkflow(id);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Track if data has been initialized
  const isInitialized = useRef(false);

  // Initialize from backend on load
  useEffect(() => {
    if (workflow && !isInitialized.current) {
      const { nodes: backendNodes, edges: backendEdges } = backendToXYFlow(workflow);
      setNodes(backendNodes);
      setEdges(backendEdges);
      isInitialized.current = true;
    }
  }, [workflow, setNodes, setEdges]);

  // Auto-save logic using interval-based approach
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedState = useRef<string>('');

  useEffect(() => {
    const currentState = JSON.stringify({ nodes, edges });
    setHasUnsavedChanges(currentState !== lastSavedState.current);
  }, [nodes, edges]);

  useEffect(() => {
    if (!id || !hasUnsavedChanges) return;

    const interval = setInterval(async () => {
      if (hasUnsavedChanges && nodes.length > 0) {
        const payload = xyFlowToBackend(nodes, edges);
        await updateMutation.mutateAsync({
          nodes: payload.nodes,
          edges: payload.edges,
        });
        lastSavedState.current = JSON.stringify({ nodes, edges });
        setHasUnsavedChanges(false);
      }
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [id, hasUnsavedChanges, nodes, edges, updateMutation]);

  // Manual save
  const handleSave = async () => {
    if (!id) return;
    const payload = xyFlowToBackend(nodes, edges);
    await updateMutation.mutateAsync({
      nodes: payload.nodes,
      edges: payload.edges,
    });
    lastSavedState.current = JSON.stringify({ nodes, edges });
    setHasUnsavedChanges(false);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleRun = () => {
    console.log('Run workflow - TODO');
  };

  // Dummy node state
  const [nodePickerOpen, setNodePickerOpen] = useState(false);
  const [selectedDummyInfo, setSelectedDummyInfo] = useState<{
    dummyId: string;
    sourceNodeId: string;
    sourceHandleId: string;
  } | null>(null);

  // Handle dummy node click
  const handleDummyNodeClick = useCallback((dummyId: string, data: WorkflowNodeData) => {
    setSelectedDummyInfo({
      dummyId,
      sourceNodeId: data.sourceNodeId!,
      sourceHandleId: data.sourceHandleId!,
    });
    setNodePickerOpen(true);
  }, []);

  // Generate dummy nodes and add their edges to state
  const dummyNodes = useDummyNodes(nodes, edges, handleDummyNodeClick, setEdges);
  const allNodes = useMemo(() => [...nodes, ...dummyNodes], [nodes, dummyNodes]);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const [activeActionNodeId, setActiveActionNodeId] = useState<string | null>(null);

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
            : definition?.shape === 'rectangleWithText'
            ? 'rectangleWithText'
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

  // Handle node selection from picker modal
  const handleNodeSelected = useCallback(
    (definitionId: string) => {
      if (!selectedDummyInfo) return;

      const { sourceNodeId, sourceHandleId } = selectedDummyInfo;

      // Find the source node to calculate position
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      // Calculate position to the right of source node
      const position = {
        x: sourceNode.position.x + 150,
        y: sourceNode.position.y,
      };

      // Create new real node at calculated position
      const newNodeId = nanoid();
      const definition = NODE_DEFINITIONS_BY_ID[definitionId];

      // Add new real node
      setNodes((nds) => [
        ...nds,
        {
          id: newNodeId,
          type:
            definition?.shape === 'oppositeD'
              ? 'oppositeD'
              : definition?.shape === 'roundedRectangle'
              ? 'roundedRectangle'
              : definition?.shape === 'rectangleWithText'
              ? 'rectangleWithText'
              : 'circle',
          position,
          data: {
            label: definition?.name || definitionId,
            definitionId,
            actionState: {},
          },
        },
      ]);

      // Get first input handle ID
      const newNodeHandles = definition?.handles || [];
      const firstInputHandle = newNodeHandles.find((h) => h.kind === 'input');
      const targetHandleId = firstInputHandle?.id || 'in';

      // UPDATE EXISTING EDGE
      setEdges((eds) => {
        return eds.map((edge) => {
          if (
            edge.data?.isDummyEdge &&
            edge.source === sourceNodeId &&
            edge.sourceHandle === sourceHandleId
          ) {
            return {
              ...edge,
              target: newNodeId,
              targetHandle: targetHandleId,
              data: {},
            };
          }
          return edge;
        });
      });

      // Close modal
      setNodePickerOpen(false);
      setSelectedDummyInfo(null);
    },
    [selectedDummyInfo, nodes, setNodes, setEdges]
  );

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-300">Loading workflow...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error loading workflow: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <EditorTopBar
        workflowId={id}
        workflowName={workflow?.name}
        status={workflow?.status || "DRAFT"}
        onSave={handleSave}
        onRun={handleRun}
        isSaving={updateMutation.isPending}
        isRunning={false}
        hasUnsavedChanges={hasUnsavedChanges}
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
            nodes={allNodes}
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

      {/* Node Picker Modal */}
      <NodePickerModal
        isOpen={nodePickerOpen}
        onClose={() => {
          setNodePickerOpen(false);
          setSelectedDummyInfo(null);
        }}
        onSelectNode={handleNodeSelected}
      />
    </div>
  );
}
