import { Fragment, useEffect, useMemo } from 'react';
import {
  Handle,
  Position,
  type NodeProps,
  useUpdateNodeInternals,
} from '@xyflow/react';
import { NODE_DEFINITIONS_BY_ID } from '../../nodeTemplates';
import type { NodeTemplateConfig } from '../../nodeConfigSchema';
import { getEffectiveHandles } from './workflowValidation';

const GRID_COLOR = '#1f2937';

type NodeData = {
  label?: string;
  definitionId: string;
  actionState?: Record<string, unknown>;
};

function getTemplate(data: NodeData): NodeTemplateConfig | null {
  return NODE_DEFINITIONS_BY_ID[data.definitionId] ?? null;
}

function BaseNode({
  id,
  data,
  selected,
  shape,
}: NodeProps & { shape: 'circle' | 'oppositeD' | 'roundedRectangle' | 'rectangleWithText' }) {
  const nodeData = data as NodeData & { unsatisfied?: boolean };
  const tpl = getTemplate(nodeData);
  const effectiveHandles = getEffectiveHandles(tpl, nodeData);
  const label = nodeData.label ?? tpl?.name ?? '';
  const handleCount = effectiveHandles.length ?? 0;
  const extraHandles = Math.max(0, handleCount - 4);
  const scale = 1 + extraHandles * 0.15;

  // rectangleWithText is larger than standard roundedRectangle
  const baseSize = shape === 'rectangleWithText' ? 80 : 48;
  const size = baseSize * scale;
  const unsatisfied = nodeData.unsatisfied === true;

  // Get inline text from actionState for rectangleWithText shape
  const inlineText = shape === 'rectangleWithText'
    ? String(nodeData.actionState?.inlineText ?? 'LLM')
    : '';

  // When handles are dynamic (e.g. actionState changes), React Flow needs to
  // recalculate handle bounds. Otherwise edges referencing new handle IDs
  // exist in state but won't render.
  const updateNodeInternals = useUpdateNodeInternals();
  const handleSignature = useMemo(
    () => effectiveHandles.map((h) => `${h.kind}:${h.id}:${h.side}`).join('|'),
    [effectiveHandles],
  );
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleSignature, updateNodeInternals]);

  const baseClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'oppositeD'
      ? 'rounded-l-full rounded-r-md'
      : 'rounded-xl';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ${baseClass}`}
        style={{
          width: shape === 'rectangleWithText' ? `${size * 1.5}px` : `${size}px`,
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
        {shape === 'rectangleWithText' && inlineText && (
          <div className="absolute inset-0 flex items-center justify-center px-2">
            <span className="text-xs text-slate-100 font-medium truncate max-w-full">
              {inlineText}
            </span>
          </div>
        )}

        {tpl
          ? effectiveHandles.map((h) => {
              const sideHandles = effectiveHandles.filter(
                (hh) => hh.side === h.side,
              );
              const sideIndex = sideHandles.findIndex((hh) => hh.id === h.id);
              const sideCount = sideHandles.length || 1;
              const offset = ((sideIndex + 1) / (sideCount + 1)) * 100;

              const position =
                h.side === 'left'
                  ? Position.Left
                  : h.side === 'right'
                  ? Position.Right
                  : h.side === 'top'
                  ? Position.Top
                  : Position.Bottom;

              const style =
                h.side === 'left' || h.side === 'right'
                  ? { top: `${offset}%` }
                  : { left: `${offset}%` };

              return (
                <Fragment key={h.id}>
                  <Handle
                    id={h.id}
                    type={h.kind === 'input' ? 'target' : 'source'}
                    position={position}
                    style={style}
                    className="w-1 h-1 bg-slate-500"
                  />
                  {h.label && (
                    <span
                      className="pointer-events-none select-none text-[9px] text-slate-300 absolute"
                      style={
                        h.side === 'left'
                          ? { top: `${offset}%`, left: '-0.75rem' }
                          : h.side === 'right'
                          ? { top: `${offset}%`, right: '-0.75rem' }
                          : h.side === 'top'
                          ? { top: '-0.75rem', left: `${offset}%` }
                          : { bottom: '-0.75rem', left: `${offset}%` }
                      }
                    >
                      {h.label}
                    </span>
                  )}
                </Fragment>
              );
            })
          : null}
      </div>
      <div className="mt-1 text-[11px] text-slate-100">{label}</div>
    </div>
  );
}

export function CircleNode(props: NodeProps) {
  return <BaseNode {...props} shape="circle" />;
}

export function OppositeDNode(props: NodeProps) {
  return <BaseNode {...props} shape="oppositeD" />;
}

export function RoundedRectangleNode(props: NodeProps) {
  return <BaseNode {...props} shape="roundedRectangle" />;
}

export function RectangleWithTextNode(props: NodeProps) {
  return <BaseNode {...props} shape="rectangleWithText" />;
}
