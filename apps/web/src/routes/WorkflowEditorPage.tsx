import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { EditorTopBar } from '../features/workflow-editor/EditorTopBar';
import { NodeLibraryDrawer } from '../features/workflow-editor/NodeLibraryDrawer';
import { Canvas } from '../features/workflow-editor/Canvas';
import { NodeConfigDialog } from '../features/workflow-editor/dialog/NodeConfigDialog';
import { getUnsatisfiedNodeIds } from '../features/workflow-editor/workflowValidation';
import { useDummyNodes } from '../features/workflow-editor/nodes/useDummyNodes';
import { useWorkflow, useUpdateWorkflow } from '../hooks/useWorkflow';
import { backendToXYFlow, XYFlowToBackend } from '../utils/workflowTransform';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { WorkflowNode, NodeExecutionState } from '@n8n-project/shared';
import { useNodeDefinitions } from '../hooks/useNodeDefinitions';
import { useExecute } from '../hooks/useExecute';

export function WorkflowEditorPage() {
  const { id } = useParams<{id: string}>();
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(true);

  // Load workflow from backend
  const { data: workflow, isLoading, error } = useWorkflow(id);
  const updateMutation = useUpdateWorkflow(id);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { definitionsById } = useNodeDefinitions();

  const { executeNode } = useExecute((nodeId, state: NodeExecutionState) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...(n.data as WorkflowNode), state } } : n,
      ),
    );
  });

  // Track if data has been initialized
  const isInitialized = useRef(false);

  // Initialize from backend on load
  useEffect(() => {
    if (workflow && !isInitialized.current) {
      const { nodes: backendNodes, edges: backendEdges } = backendToXYFlow(workflow, definitionsById);
      setNodes(backendNodes);
      setEdges(backendEdges);
      isInitialized.current = true;
    }
  }, [workflow, setNodes, setEdges]);

  // Auto-save logic using interval-based approach
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedState = useRef<string>('');

  useEffect(() => {
    const currentState = JSON.stringify({ nodes, edges });
    setHasUnsavedChanges(currentState !== lastSavedState.current);
  }, [nodes, edges]);

  // useEffect(() => {
  //   if (!id || !hasUnsavedChanges) return;

  //   const interval = setInterval(async () => {
  //     if (hasUnsavedChanges && nodes.length > 0) {
  //       handleSave();
  //     }
  //   }, 3000); // 3 seconds

  //   return () => clearInterval(interval);
  // }, [hasUnsavedChanges, nodes, edges]);

  // Manual save
  const handleSave = async () => {
    if (!id) return;
    try {
      const payload = XYFlowToBackend(nodes, edges);
      await updateMutation.mutateAsync({
        nodes: payload.nodes,
        edges: payload.edges,
      });
      lastSavedState.current = JSON.stringify({ nodes, edges });
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setSaveError(err.message || 'Error saving workflow');
      // console.log error
      console.error('Error saving workflow:', err);
    }
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

  // Generate dummy nodes and edges
  const { dummyNodes, dummyEdges } = useDummyNodes(nodes, edges);
  const allNodes = useMemo(() => [...nodes, ...dummyNodes], [nodes, dummyNodes]);
  const allEdges = useMemo(() => [...edges, ...dummyEdges], [edges, dummyEdges]);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const [activeActionNodeId, setActiveActionNodeId] = useState<string | null>(null);

  const handleAddNodeAtPosition = (
    definitionId: string,
    position: { x: number; y: number },
  ) => {
    const idStr = nanoid();
    const definition = definitionsById[definitionId];
    const label = definition.label;

    setNodes((nds) => [
      ...nds,
      ({
        id: idStr,
        type: definition.shape,
        position,
        data: ({
          id: idStr,
          type: definition.type,
          version: definition.version,
          category: definition.category,
          positionX: position.x,
          positionY: position.y,
          config: definition.config,
          label: label,
          description: definition.description,
          inputHandles: definition.inputHandles,
          outputHandles: definition.outputHandles,
          configHandles: definition.configHandles,
        } as WorkflowNode),
      } as Node<WorkflowNode>),
    ]);
  };

  const unsatisfiedNodeIds = useMemo(
    () => getUnsatisfiedNodeIds(nodes, edges),
    [nodes, edges],
  );

  const activeNode = activeActionNodeId
    ? nodes.find((n) => n.id === activeActionNodeId)
    : undefined;
  const activeTemplate = activeNode?.data;

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
        workflowName={workflow?.name ?? 'Untitled Workflow'}
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
          {/* {saveError && (
            <div className="shrink-0 px-4 py-1.5 bg-red-950/80 border-b border-red-700/50 text-red-200 text-xs">
              {saveError}
            </div>
          )} */}
          <div className="flex-1 min-h-0">
          <Canvas
            nodes={allNodes}
            edges={allEdges}
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

      {/* Node Config Dialog */}
      {activeNode && activeTemplate && (
        <NodeConfigDialog
          key={activeNode.id}
          nodeData={activeTemplate}
          definition={definitionsById[activeTemplate.type]}
          executionState={activeTemplate.state}
          isOpen={true}
          onClose={() => setActiveActionNodeId(null)}
          onSave={(updates) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === activeNode.id
                  ? {
                      ...n,
                      data: {
                        ...(n.data as WorkflowNode),
                        ...updates,
                      },
                    }
                  : n,
              ),
            );
          }}
          onExecute={(configValues, inputData) => {
            executeNode({
              nodeId: activeNode.id,
              type: activeTemplate.type,
              version: activeTemplate.version,
              config: configValues,
              inputs: inputData,
            });
          }}
        />
      )}
    </div>
  );
}
