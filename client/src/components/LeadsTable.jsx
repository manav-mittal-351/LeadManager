import { Edit2, Trash2, Mail, Phone, Building2, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function LeadsTable({
  leads,
  loading,
  pagination,
  onPageChange,
  onEditLead,
  onDeleteLead,
}) {
  const { page = 1, limit = 10, totalLeads = 0, totalPages = 1 } = pagination || {};

  const startLead = totalLeads === 0 ? 0 : (page - 1) * limit + 1;
  const endLead = Math.min(page * limit, totalLeads);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 font-medium text-slate-500 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="h-3.5 bg-slate-200 rounded w-24" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 bg-slate-200 rounded w-32" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 bg-slate-200 rounded w-20" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 bg-slate-200 rounded w-24" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                  <td className="py-3.5 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-12 ml-auto" /></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-slate-800 text-sm mb-0.5">No leads found</h3>
                    <p className="text-slate-400 text-xs">
                      Try adjusting your name search or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Leads Rows
              leads.map((lead) => (
                <tr
                  key={lead.id || lead._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Name */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {lead.name}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-600">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{lead.email}</span>
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 text-slate-600">
                    {lead.phone ? (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Company */}
                  <td className="py-3 px-4 text-slate-700">
                    {lead.company ? (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.company}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4">
                    <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {lead.source}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Edit lead"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteLead(lead)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Delete lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Minimal Pagination Footer */}
      {totalLeads > 0 && (
        <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700">{startLead}</span> to{' '}
            <span className="font-medium text-slate-700">{endLead}</span> of{' '}
            <span className="font-medium text-slate-700">{totalLeads}</span> leads
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">
              Page {page} of {totalPages}
            </span>

            <div className="inline-flex gap-1">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-2 py-1 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-2 py-1 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
