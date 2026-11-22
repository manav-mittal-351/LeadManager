export default function DashboardCounts({ counts, activeStatus, onSelectStatus }) {
  const items = [
    { key: 'All', label: 'Total Leads', count: counts?.total ?? 0 },
    { key: 'New', label: 'New', count: counts?.new ?? 0 },
    { key: 'Contacted', label: 'Contacted', count: counts?.contacted ?? 0 },
    { key: 'Qualified', label: 'Qualified', count: counts?.qualified ?? 0 },
    { key: 'Lost', label: 'Lost', count: counts?.lost ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {items.map((item) => {
        const isActive = activeStatus === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectStatus(item.key)}
            className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div
              className={`text-[11px] font-medium tracking-wide uppercase ${
                isActive ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              {item.label}
            </div>
            <div className="text-2xl font-bold tracking-tight mt-1">
              {item.count}
            </div>
          </button>
        );
      })}
    </div>
  );
}
