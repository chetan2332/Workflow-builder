import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { addEdge, useEdgesState, useNodesState, type Connection, type Edge, type Node } from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { WorkflowNode, NodeExecutionState } from '@n8n-project/shared';
import { EditorTopBar } from '../features/workflow-editor/EditorTopBar';
import { NodeLibraryDrawer } from '../features/workflow-editor/NodeLibraryDrawer';
import { Canvas } from '../features/workflow-editor/Canvas';
import { NodeConfigDialog } from '../features/workflow-editor/dialog/NodeConfigDialog';
import { useDummyNodes } from '../features/workflow-editor/nodes/useDummyNodes';
import { getUnsatisfiedNodeIds } from '../features/workflow-editor/workflowValidation';
import { useWorkflow, useUpdateWorkflow } from '../hooks/useWorkflow';
import { useNodeDefinitions } from '../hooks/useNodeDefinitions';
import { useExecute } from '../hooks/useExecute';
import { backendToXYFlow, XYFlowToBackend } from '../utils/workflowTransform';
import { AlertTriangle } from 'lucide-react';

export function WorkflowEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  const { data: workflow, isLoading, error } = useWorkflow(id);
  const updateMutation = useUpdateWorkflow(id);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { definitionsById } = useNodeDefinitions();

  const { executeNode } = useExecute((nodeId, state: NodeExecutionState) => {
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...(n.data as WorkflowNode), state } } : n));
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (workflow && !initialized.current && Object.keys(definitionsById).length > 0) {
      const { nodes: bn, edges: be } = backendToXYFlow(workflow, definitionsById);
      setNodes(bn);
      setEdges(be);
      initialized.current = true;
    }
  }, [workflow, definitionsById, setNodes, setEdges]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSaved = useRef('');

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify({ nodes, edges }) !== lastSaved.current);
  }, [nodes, edges]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!id) return;
    const payload = XYFlowToBackend(nodes, edges);
    await updateMutation.mutateAsync({ nodes: payload.nodes, edges: payload.edges });
    lastSaved.current = JSON.stringify({ nodes, edges });
    setHasUnsavedChanges(false);
  };

  const handleRun = () => { /* TODO: trigger workflow execution */ };

  const { dummyNodes, dummyEdges } = useDummyNodes(nodes, edges);
  const allNodes = useMemo(() => [...nodes, ...dummyNodes], [nodes, dummyNodes]);
  const allEdges = useMemo(() => [...edges, ...dummyEdges], [edges, dummyEdges]);

  const onConnect = (connection: Connection) => {
    setEdges(eds => addEdge(connection, eds));
  };

  const unsatisfiedNodeIds = useMemo(() => getUnsatisfiedNodeIds(nodes, edges), [nodes, edges]);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const handleAddNodeAtPosition = (definitionId: string, position: { x: number; y: number }) => {
    const idStr = nanoid();
    const def = definitionsById[definitionId];
    if (!def) return;
    setNodes(nds => [...nds, {
      id: idStr,
      type: def.shape,
      position,
      data: {
        id: idStr, type: def.type, version: def.version,
        category: def.category,
        positionX: position.x, positionY: position.y,
        configValues: def.defaultConfigValues,
        label: def.label, description: def.description,
        inputHandles: def.inputHandles, outputHandles: def.outputHandles,
        configHandles: def.configHandles,
      } as WorkflowNode,
    } as Node<WorkflowNode>]);
  };

  const activeNode = activeNodeId ? nodes.find(n => n.id === activeNodeId) : undefined;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
        <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
        <span style={{ fontSize: 13, color: 'var(--danger)' }}>Error loading workflow</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditorTopBar
        workflowName={workflow?.name ?? 'Untitled'}
        status={workflow?.status ?? 'DRAFT'}
        onSave={handleSave}
        onRun={handleRun}
        isSaving={updateMutation.isPending}
        isRunning={false}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Node library */}
        <div style={{ position: 'relative', height: '100%', flexShrink: 0 }}>
          <NodeLibraryDrawer isOpen={isLibraryOpen} onToggle={() => setIsLibraryOpen(v => !v)} />
        </div>

        {/* Canvas area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {unsatisfiedNodeIds.size > 0 && (
            <div style={{
              flexShrink: 0, padding: '0.375rem 1rem',
              backgroundColor: 'rgba(245,158,11,0.08)',
              borderBottom: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <AlertTriangle size={12} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>
                {unsatisfiedNodeIds.size} node{unsatisfiedNodeIds.size !== 1 ? 's' : ''} have unconnected inputs.
              </span>
            </div>
          )}

          <div style={{ flex: 1, minHeight: 0 }}>
            <Canvas
              nodes={allNodes}
              edges={allEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDoubleClick={node => setActiveNodeId(node.id)}
              onAddNodeAtPosition={handleAddNodeAtPosition}
              unsatisfiedNodeIds={unsatisfiedNodeIds}
            />
          </div>
        </div>
      </div>

      {/* Node config dialog */}
      {activeNode && (
        <NodeConfigDialog
          key={activeNode.id}
          nodeData={activeNode.data}
          definition={definitionsById[activeNode.data.type]}
          executionState={activeNode.data.state}
          isOpen={true}
          onClose={() => setActiveNodeId(null)}
          onSave={(configValues, outputHandles, inputHandles) => {
            setNodes(nds => nds.map(n =>
              n.id === activeNode.id
                ? { ...n, data: { ...(n.data as WorkflowNode), configValues, outputHandles, inputHandles } }
                : n,
            ));
          }}
          onExecute={(configValues, inputData) => {
            executeNode({
              nodeId: activeNode.id,
              type: activeNode.data.type,
              version: activeNode.data.version,
              config: Object.fromEntries(Object.entries(configValues).filter(([, v]) => v != null)),
              inputs: inputData,
            });
          }}
        />
      )}
    </div>
  );
}
