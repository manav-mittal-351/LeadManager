export default function StatusBadge({ status }) {
  const config = {
    New: 'bg-sky-50 text-sky-700 border-sky-200',
    Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    Qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Lost: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const badgeStyle = config[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${badgeStyle}`}
    >
      {status}
    </span>
  );
}
