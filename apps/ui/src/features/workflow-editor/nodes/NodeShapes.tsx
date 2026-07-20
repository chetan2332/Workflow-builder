import { Fragment, useEffect, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/react';
import { NodeShape, NodeCategory, type WorkflowNode } from '@n8n-project/shared';
import { Zap, Code2, GitBranch, Box, Globe, FunctionSquare, Brain, GitFork, Layers, SplitSquareHorizontal } from 'lucide-react';

/* ── Category → color tokens ── */

const CATEGORY_COLOR: Record<string, string> = {
  [NodeCategory.TRIGGER]: 'var(--cat-trigger)',
  [NodeCategory.CODE]:    'var(--cat-code)',
  [NodeCategory.FLOW]:    'var(--cat-flow)',
  [NodeCategory.OTHER]:   'var(--cat-other)',
};

const CATEGORY_DIM: Record<string, string> = {
  [NodeCategory.TRIGGER]: 'var(--cat-trigger-dim)',
  [NodeCategory.CODE]:    'var(--cat-code-dim)',
  [NodeCategory.FLOW]:    'var(--cat-flow-dim)',
  [NodeCategory.OTHER]:   'var(--cat-other-dim)',
};

/* ── Node type → icon ── */

const NODE_ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'trigger.start':    Zap,
  'code.http':        Globe,
  'code.function':    FunctionSquare,
  'code.llm':         Brain,
  'flow.if':          GitBranch,
  'flow.switch':      SplitSquareHorizontal,
  'flow.condition':   GitFork,
  'flow.combine':     Layers,
};

function getNodeIcon(type: string, category: string) {
  if (NODE_ICON[type]) return NODE_ICON[type];
  if (category === NodeCategory.TRIGGER) return Zap;
  if (category === NodeCategory.CODE)    return Code2;
  if (category === NodeCategory.FLOW)    return GitBranch;
  return Box;
}

/* ── BaseNode ── */

function BaseNode({ id, data, selected, shape }: NodeProps & { shape: NodeShape }) {
  const nodeData = data as WorkflowNode & { unsatisfied?: boolean };
  const category = nodeData.category ?? NodeCategory.OTHER;
  const color = CATEGORY_COLOR[category] ?? CATEGORY_COLOR[NodeCategory.OTHER];
  const dim   = CATEGORY_DIM[category]   ?? CATEGORY_DIM[NodeCategory.OTHER];

  const unsatisfied = nodeData.unsatisfied === true;
  const label = nodeData.label ?? '';
  const type  = nodeData.type ?? '';

  const allHandles = [...(nodeData.inputHandles ?? []), ...(nodeData.outputHandles ?? [])];
  const handleCount = Math.max(nodeData.inputHandles?.length ?? 0, nodeData.outputHandles?.length ?? 0);
  const extraHandles = Math.max(0, handleCount - 4);
  const scale = 1 + extraHandles * 0.15;

  const baseSize = shape === NodeShape.RECTANGLE_WITH_TEXT ? 72 : 44;
  const size = baseSize * scale;

  const Icon = getNodeIcon(type, category);

  const updateNodeInternals = useUpdateNodeInternals();
  const handleSig = useMemo(() => allHandles.map(h => h.id).join(','), [allHandles]);
  useEffect(() => { updateNodeInternals(id); }, [id, handleSig, updateNodeInternals]);

  const shapeStyle: React.CSSProperties =
    shape === NodeShape.CIRCLE
      ? { borderRadius: '50%' }
      : shape === NodeShape.OPPOSITE_D
      ? { borderRadius: '50% 8px 8px 50%' }
      : { borderRadius: 12 };

  const alpha = getComputedStyle(document.documentElement)
    .getPropertyValue('--node-border-alpha').trim() || '40';

  const borderColor = unsatisfied
    ? 'var(--danger)'
    : selected
    ? color
    : `${color}${alpha}`;

  const nodeShadowBase = getComputedStyle(document.documentElement)
    .getPropertyValue('--node-shadow').trim() || 'none';

  const boxShadow = selected
    ? `0 0 0 2px ${color}50, 0 4px 20px ${color}30`
    : unsatisfied
    ? '0 0 0 2px rgba(244,63,94,0.4)'
    : nodeShadowBase;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: shape === NodeShape.RECTANGLE_WITH_TEXT ? size * 1.5 : size,
          height: size,
          background: `linear-gradient(${dim}, ${dim}), var(--surface)`,
          border: `1.5px solid ${borderColor}`,
          boxShadow,
          transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
          transform: selected ? 'scale(1.04)' : 'scale(1)',
          ...shapeStyle,
        }}
      >
        {/* Icon or inline text */}
        {shape === NodeShape.RECTANGLE_WITH_TEXT ? (
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: color, paddingInline: 8, textAlign: 'center',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
          }}>
            {label}
          </span>
        ) : (
          <Icon size={Math.round(size * 0.4)} strokeWidth={1.75} style={{ color }} />
        )}

        {/* Handles */}
        {allHandles.map(h => {
          const sideHandles = allHandles.filter(hh => hh.type === h.type);
          const sideIndex = sideHandles.findIndex(hh => hh.id === h.id);
          const sideCount = sideHandles.length || 1;
          const offset = ((sideIndex + 1) / (sideCount + 1)) * 100;

          const position = h.type === 'input' ? Position.Left : h.type === 'output' ? Position.Right : Position.Bottom;
          const style = h.type === 'input' || h.type === 'output' ? { top: `${offset}%` } : { left: `${offset}%` };

          return (
            <Fragment key={h.id}>
              <Handle
                id={h.id}
                type={h.type === 'input' ? 'target' : 'source'}
                position={position}
                style={style}
              />
              {h.label && (
                <span style={{
                  position: 'absolute',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 8,
                  color: 'var(--text-3)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  lineHeight: 1,
                  ...(position === Position.Left
                    ? { top: `${offset}%`, left: '-0.5rem', transform: 'translateY(-50%)', textAlign: 'right' }
                    : position === Position.Right
                    ? { top: `${offset}%`, right: '-0.5rem', transform: 'translateY(-50%)' }
                    : { bottom: '-0.75rem', left: `${offset}%`, transform: 'translateX(-50%)' }),
                }}>
                  {h.label}
                </span>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Label below (not for rectangleWithText — label is inline) */}
      {shape !== NodeShape.RECTANGLE_WITH_TEXT && (
        <div style={{
          marginTop: 5,
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--text-2)',
          textAlign: 'center',
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

export function CircleNode(props: NodeProps)            { return <BaseNode {...props} shape={NodeShape.CIRCLE} />; }
export function OppositeDNode(props: NodeProps)         { return <BaseNode {...props} shape={NodeShape.OPPOSITE_D} />; }
export function RoundedRectangleNode(props: NodeProps)  { return <BaseNode {...props} shape={NodeShape.ROUNDED_RECTANGLE} />; }
export function RectangleWithTextNode(props: NodeProps) { return <BaseNode {...props} shape={NodeShape.RECTANGLE_WITH_TEXT} />; }
export function DNode(props: NodeProps)                 { return <BaseNode {...props} shape={NodeShape.D} />; }
