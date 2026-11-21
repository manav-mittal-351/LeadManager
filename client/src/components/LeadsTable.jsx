import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  Inbox,
} from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function LeadsTable({
  leads,
  loading,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onLimitChange,
  onEditLead,
  onDeleteLead,
  onQuickStatusChange,
  onResetFilters,
}) {
  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th
                onClick={() => onSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Lead Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th className="py-3.5 px-4 select-none">Contact Info</th>
              <th
                onClick={() => onSort('company')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company</span>
                  {renderSortIcon('company')}
                </div>
              </th>
              <th className="py-3.5 px-4 select-none">Source</th>
              <th
                onClick={() => onSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th
                onClick={() => onSort('created_at')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Created</span>
                  {renderSortIcon('created_at')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right select-none">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="h-4 bg-slate-200 rounded w-28" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-slate-200 rounded w-36" />
                      <div className="h-3 bg-slate-200 rounded w-24" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 bg-slate-200 rounded-full w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 bg-slate-200 rounded-full w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex gap-2">
                      <div className="w-7 h-7 bg-slate-200 rounded" />
                      <div className="w-7 h-7 bg-slate-200 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-base mb-1">No leads found</h3>
                    <p className="text-slate-500 text-xs mb-4">
                      No leads match your current search query or filter selection.
                    </p>
                    <button
                      onClick={onResetFilters}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              // Leads Data Rows
              leads.map((lead) => {
                const initials = lead.name
                  ? lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : '?';

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                          {initials}
                        </div>
                        <div>
                          <span className="block font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                            {lead.name}
                          </span>
                          {lead.notes && (
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                              {lead.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </a>
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No phone</span>
                        )}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {lead.company ? (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800">{lead.company}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {lead.source}
                      </span>
                    </td>

                    {/* Status with Quick Update Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={lead.status} />
                        <select
                          value={lead.status}
                          onChange={(e) => onQuickStatusChange(lead, e.target.value)}
                          aria-label={`Change status for ${lead.name}`}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 transition-opacity cursor-pointer focus:opacity-100"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit lead"
                          aria-label={`Edit ${lead.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete lead"
                          aria-label={`Delete ${lead.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.total > 0 && (
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold text-slate-900">{pagination.total}</span> leads
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">|</span>
              <label htmlFor="per-page-select" className="text-slate-500">Per page:</label>
              <select
                id="per-page-select"
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 outline-hidden cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous
            </button>

            <span className="px-2 text-slate-500 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
