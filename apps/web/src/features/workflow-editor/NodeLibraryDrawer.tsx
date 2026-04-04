import { GROUPED_TEMPLATES, NODE_TYPE_LABELS } from '../../nodeTemplates';
import { NodeIcon } from './NodeIcon.tsx';

const DRAG_TYPE = 'application/reactflow';

type NodeLibraryDrawerProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function NodeLibraryDrawer({
  isOpen,
  onToggle,
}: NodeLibraryDrawerProps) {
  return (
    <div className="relative h-full">
      {/* Toggle button, anchored to left */}
      <button
        onClick={onToggle}
        className="absolute left-4 top-4 z-20 btn btn-ghost px-3 py-1 text-xs border border-slate-700"
      >
        {isOpen ? '✕' : '+'}
      </button>

      {isOpen && (
        <aside className="h-full min-h-0 w-72 border-r border-slate-800 bg-slate-950/95 backdrop-blur px-4 py-4 flex flex-col gap-4 pt-10 overflow-y-auto overscroll-contain">
          {GROUPED_TEMPLATES.map((group) => (
            <section key={group.nodeType}>
              <h3 className="heading-section mb-2">
                {NODE_TYPE_LABELS[group.nodeType]} Nodes
              </h3>
              <div className="space-y-2 text-xs">
                {group.templates.map((tpl) => (
                  <div
                    key={tpl.nodeId}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(DRAG_TYPE, tpl.nodeId);
                      e.dataTransfer.effectAllowed = 'move';

                      const iconEl = (e.currentTarget as HTMLElement).querySelector(
                        '[data-node-icon="true"]',
                      ) as HTMLElement | null;
                      if (iconEl) {
                        const rect = iconEl.getBoundingClientRect();
                        e.dataTransfer.setDragImage(
                          iconEl,
                          Math.round(rect.width / 2),
                          Math.round(rect.height / 2),
                        );
                      }
                    }}
                    className="w-full text-left app-card px-3 py-2 hover:bg-slate-900 cursor-grab active:cursor-grabbing"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-2">
                        <div className="pt-0.5" data-node-icon="true">
                          <NodeIcon shape={tpl.shape} handles={tpl.handles} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="font-medium text-slate-100 truncate">
                              {tpl.name}
                            </span>
                            <span className="shrink-0 text-[10px] uppercase text-slate-500">
                              {NODE_TYPE_LABELS[tpl.nodeType]}
                            </span>
                          </div>
                          <p className="text-xs-muted line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </aside>
      )}
    </div>
  );
}