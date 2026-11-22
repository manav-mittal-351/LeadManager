import { Search, X, Plus } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];

export default function LeadsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onOpenAddModal,
}) {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs mb-5 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search by name only */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-lg border border-slate-200 focus:border-slate-900 transition-all outline-hidden placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Add Lead Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Status:
        </span>
        {STATUS_OPTIONS.map((st) => {
          const isActive = status === st;
          return (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>
    </div>
  );
}
