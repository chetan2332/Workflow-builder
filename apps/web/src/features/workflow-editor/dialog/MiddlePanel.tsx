interface MiddlePanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[]; // Which tabs to show (from node config)
  children: React.ReactNode;
}

export function MiddlePanel({
  activeTab,
  onTabChange,
  tabs,
  children,
}: MiddlePanelProps) {
  return (
    <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex border-b border-slate-700 bg-slate-900/50">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 text-slate-100 border-b-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}
