import { useCallback } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import { isValidConnection } from './workflowValidation';
import type { WorkflowNode } from '@n8n-project/shared';
import { DRAG_TYPE } from './NodeLibraryDrawer';

type CanvasProps = {
  nodes: Node<WorkflowNode>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<WorkflowNode>>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (connection: Connection) => void;
  onNodeDoubleClick?: (node: Node<WorkflowNode>) => void;
  onAddNodeAtPosition: (definitionId: string, position: { x: number; y: number }) => void;
  unsatisfiedNodeIds: Set<string>;
};

function CanvasInner({
  nodes, edges,
  onNodesChange, onEdgesChange, onConnect,
  onNodeDoubleClick, onAddNodeAtPosition, unsatisfiedNodeIds,
}: CanvasProps) {
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const id = event.dataTransfer.getData(DRAG_TYPE);
    if (!id) return;
    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    onAddNodeAtPosition(id, pos);
  }, [screenToFlowPosition, onAddNodeAtPosition]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const isValidCb = useCallback(
    (connection: Connection | Edge) => {
      const c = 'source' in connection
        ? { source: connection.source, sourceHandle: connection.sourceHandle ?? null, target: connection.target, targetHandle: connection.targetHandle ?? null }
        : connection;
      return isValidConnection(nodes, edges, c);
    },
    [nodes, edges],
  );

  const nodesWithValidation = nodes.map(n => ({
    ...n,
    data: { ...(n.data as WorkflowNode), unsatisfied: n.data?.isDummy ? false : unsatisfiedNodeIds.has(n.id) },
  }));

  return (
    <ReactFlow
      nodes={nodesWithValidation}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      isValidConnection={isValidCb}
      onNodeDoubleClick={(_, node) => onNodeDoubleClick?.(node as Node<WorkflowNode>)}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="w-full h-full"
      nodeTypes={nodeTypes}
      deleteKeyCode={['Backspace', 'Delete']}
      selectionOnDrag
      panOnDrag={[1, 2]}
      defaultEdgeOptions={{ type: 'default', markerEnd: { type: MarkerType.ArrowClosed } }}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1.5}
        color="var(--dot-color)"
      />
      <Controls />
    </ReactFlow>
  );
}

export function Canvas(props: CanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg)' }}>
      <ReactFlowProvider>
        <CanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
