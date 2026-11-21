import { Edit2, Trash2, Mail, Phone, Building2, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function LeadsTable({
  leads,
  loading,
  onEditLead,
  onDeleteLead,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-36" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-slate-200 rounded w-24" />
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
                    <p className="text-slate-500 text-xs">
                      Try adjusting your name search or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Leads Data Rows
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Name */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {lead.name}
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-xs">
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{lead.email}</span>
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {lead.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    {lead.company ? (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.company}</span>
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

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Actions: Edit & Delete */}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
