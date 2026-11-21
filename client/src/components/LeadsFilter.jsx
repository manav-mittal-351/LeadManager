import { Search, X, Plus, Filter } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS = ['All', 'Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other'];

export default function LeadsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onOpenAddModal,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Dropdown & Add Lead Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="All">All Sources</option>
              {SOURCE_OPTIONS.filter((s) => s !== 'All').map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Status:
        </span>
        {STATUS_OPTIONS.map((st) => {
          const isActive = status === st;
          return (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
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
