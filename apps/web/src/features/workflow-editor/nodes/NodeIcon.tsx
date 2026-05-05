import { Fragment, useMemo } from 'react';
import type { Handle, NodeShape } from '@n8n-project/shared';

type NodeIconProps = {
  shape: NodeShape;
  handles: Handle[];
};

export function NodeIcon({ shape, handles }: NodeIconProps) {
  const radiusClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'oppositeD'
        ? 'rounded-l-full rounded-r-md'
        : 'rounded-lg';

  const handlesBySide = useMemo(() => {
    // Infer sides from handle type: inputs=left, outputs=right, config=bottom
    return {
      left: handles.filter((h) => h.type === 'input'),
      right: handles.filter((h) => h.type === 'output'),
      top: [] as Handle[],
      bottom: handles.filter((h) => h.type === 'config'),
    };
  }, [handles]);

  return (
    <div
      className={`relative h-6 w-6 ${radiusClass}`}
      style={{
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        border: '1px solid rgba(71, 85, 105, 0.9)',
      }}
      aria-hidden="true"
    >
      {(Object.keys(handlesBySide) as Array<keyof typeof handlesBySide>).map(
        (side) => {
          const sideHandles = handlesBySide[side];
          const sideCount = sideHandles.length || 1;

          return sideHandles.map((h, idx) => {
            const offset = ((idx + 1) / (sideCount + 1)) * 100;
            const style =
              side === 'left'
                ? { left: '-3px', top: `${offset}%`, transform: 'translateY(-50%)' }
                : side === 'right'
                  ? { right: '-3px', top: `${offset}%`, transform: 'translateY(-50%)' }
                  : side === 'top'
                    ? { top: '-3px', left: `${offset}%`, transform: 'translateX(-50%)' }
                    : { bottom: '-3px', left: `${offset}%`, transform: 'translateX(-50%)' };

            return (
              <Fragment key={`${side}:${h.id}`}>
                <span
                  className="absolute h-1 w-1 rounded-full bg-slate-400"
                  style={style}
                  title={h.label ?? h.id}
                />
              </Fragment>
            );
          });
        },
      )}
    </div>
  );
}

