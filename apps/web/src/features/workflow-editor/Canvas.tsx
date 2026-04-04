import { useCallback } from 'react';
import {
  Background,
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
import { nodeTypes } from './NodeTypes';
import { isValidConnection } from './workflowValidation';
import type { NodeDefinitionId } from '../../nodeTemplates';


const DRAG_TYPE = 'application/reactflow';
const CANVAS_BG = '#020617';
const GRID_COLOR = '#1f2937';

type CanvasInnerProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (connection: Connection) => void;
  onNodeDoubleClick?: (node: Node) => void;
  onAddNodeAtPosition: (definitionId: NodeDefinitionId, position: { x: number; y: number }) => void;
  unsatisfiedNodeIds: Set<string>;
};

function CanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  onAddNodeAtPosition,
  unsatisfiedNodeIds,
}: CanvasInnerProps) {
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const definitionId = event.dataTransfer.getData(DRAG_TYPE) as NodeDefinitionId;
      if (!definitionId) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      onAddNodeAtPosition(definitionId, position);
    },
    [screenToFlowPosition, onAddNodeAtPosition],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection);
    },
    [onConnect],
  );

  const nodesWithValidation = nodes.map((n) => ({
    ...n,
    data: {
      ...(n.data as object),
      unsatisfied: unsatisfiedNodeIds.has(n.id),
    },
  }));

  const isValidConnectionCallback = useCallback(
    (connection: Connection | Edge) => {
      const c =
        'source' in connection
          ? {
              source: connection.source,
              sourceHandle: connection.sourceHandle ?? null,
              target: connection.target,
              targetHandle: connection.targetHandle ?? null,
            }
          : connection;
      return isValidConnection(nodes, edges, c);
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodesWithValidation}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      isValidConnection={isValidConnectionCallback}
      onNodeDoubleClick={(_, node) => onNodeDoubleClick?.(node as Node)}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="w-full h-full"
      nodeTypes={nodeTypes}
      deleteKeyCode={['Backspace', 'Delete']}
      selectionOnDrag
      panOnDrag={[1, 2]}
      defaultEdgeOptions={{
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    >
      <Background gap={11} size={1} color={GRID_COLOR} />
      <Controls />
    </ReactFlow>
  );
}

type CanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (connection: Connection) => void;
  onNodeDoubleClick?: (node: Node) => void;
  onAddNodeAtPosition: (definitionId: NodeDefinitionId, position: { x: number; y: number }) => void;
  unsatisfiedNodeIds: Set<string>;
};

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  onAddNodeAtPosition,
  unsatisfiedNodeIds,
}: CanvasProps) {
  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: CANVAS_BG }}
    >
      <ReactFlowProvider>
        <CanvasInner
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onAddNodeAtPosition={onAddNodeAtPosition}
          unsatisfiedNodeIds={unsatisfiedNodeIds}
        />
      </ReactFlowProvider>
    </div>
  );
}