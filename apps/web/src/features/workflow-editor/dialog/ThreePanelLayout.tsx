export function ThreePanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 h-full min-h-0">
      {children}
    </div>
  );
}
