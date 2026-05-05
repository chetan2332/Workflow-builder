import { Fragment, useEffect, useMemo } from 'react';
import {
  Handle,
  Position,
  type NodeProps,
  useUpdateNodeInternals,
} from '@xyflow/react';
import { NodeShape, type WorkflowNode } from '@n8n-project/shared';

const GRID_COLOR = '#1f2937';

function BaseNode({
  id,
  data,
  selected,
  shape,
}: NodeProps & { shape: NodeShape }) {
  const nodeData = data as WorkflowNode & { unsatisfied?: boolean };
  const handleCount = Math.max(nodeData.inputHandles.length, nodeData.outputHandles?.length) || 0;
  const effectiveHandles = nodeData.inputHandles.concat(nodeData.outputHandles || []);
  const label = nodeData.label ?? '';
  const extraHandles = Math.max(0, handleCount - 4);
  const scale = 1 + extraHandles * 0.15;

  // rectangleWithText is larger than standard roundedRectangle
  const baseSize = shape === NodeShape.RECTANGLE_WITH_TEXT ? 80 : 48;
  const size = baseSize * scale;
  const unsatisfied = nodeData.unsatisfied === true;

  // Get inline text from actionState for rectangleWithText shape
  const inlineText = shape === NodeShape.RECTANGLE_WITH_TEXT
    ? String(nodeData.label)
    : '';

  // When handles are dynamic (e.g. actionState changes), React Flow needs to
  // recalculate handle bounds. Otherwise edges referencing new handle IDs
  // exist in state but won't render.
  const updateNodeInternals = useUpdateNodeInternals();
  const handleSignature = useMemo(
    () => effectiveHandles.map(h => h.id).join(','),
    [effectiveHandles],
  );
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleSignature, updateNodeInternals]);

  const baseClass =
    shape === NodeShape.CIRCLE
      ? 'rounded-full'
      : shape === NodeShape.OPPOSITE_D
      ? 'rounded-l-full rounded-r-md'
      : 'rounded-xl';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ${baseClass}`}
        style={{
          width: shape === NodeShape.RECTANGLE_WITH_TEXT ? `${size * 1.5}px` : `${size}px`,
          height: `${size}px`,
          backgroundColor: GRID_COLOR,
          borderColor: unsatisfied ? 'rgba(239, 68, 68, 0.9)' : 'rgba(75, 85, 99, 0.9)',
          borderStyle: 'solid',
          borderWidth: unsatisfied ? 2 : 1,
          boxShadow: selected ? '0 0 16px rgba(56, 189, 248, 0.55)' : 'none',
          transform: selected ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {/* Display inline text for rectangleWithText shape */}
        {shape === NodeShape.RECTANGLE_WITH_TEXT && inlineText && (
          <div className="absolute inset-0 flex items-center justify-center px-2">
            <span className="text-xs text-slate-100 font-medium truncate max-w-full">
              {inlineText}
            </span>
          </div>
        )}

        {effectiveHandles.map((h) => {
              const sideHandles = effectiveHandles.filter(
                (hh) => hh.type === h.type,
              );
              const sideIndex = sideHandles.findIndex((hh) => hh.id === h.id);
              const sideCount = sideHandles.length || 1;
              const offset = ((sideIndex + 1) / (sideCount + 1)) * 100;

              const position =
                h.type === 'input'
                  ? Position.Left
                  : h.type === 'output'
                  ? Position.Right
                  : Position.Bottom

              const style =
                h.type === 'input' || h.type === 'output'
                  ? { top: `${offset}%` }
                  : { left: `${offset}%` };

              return (
                <Fragment key={h.id}>
                  <Handle
                    id={h.id}
                    type={h.type === 'input' ? 'target' : 'source'}
                    position={position}
                    style={style}
                    className="w-1 h-1 bg-slate-500"
                  />
                  {h.label && (
                    <span
                      className="pointer-events-none select-none text-[9px] text-slate-300 absolute"
                      style={
                        position === Position.Left
                          ? { top: `${offset}%`, left: '-0.75rem' }
                          : position === Position.Right
                          ? { top: `${offset}%`, right: '-0.75rem' }
                          : { bottom: '-0.75rem', left: `${offset}%` }
                      }
                    >
                      {h.label}
                    </span>
                  )}
                </Fragment>
              );
            })
          }
      </div>
      <div className="mt-1 text-[11px] text-slate-100">{label}</div>
    </div>
  );
}

export function CircleNode(props: NodeProps) {
  return <BaseNode {...props} shape={NodeShape.CIRCLE} />;
}

export function OppositeDNode(props: NodeProps) {
  return <BaseNode {...props} shape={NodeShape.OPPOSITE_D} />;
}

export function RoundedRectangleNode(props: NodeProps) {
  return <BaseNode {...props} shape={NodeShape.ROUNDED_RECTANGLE} />;
}

export function RectangleWithTextNode(props: NodeProps) {
  return <BaseNode {...props} shape={NodeShape.RECTANGLE_WITH_TEXT} />;
}
