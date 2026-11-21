export default function StatusBadge({ status }) {
  const config = {
    New: {
      badge: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
      dot: 'bg-sky-500',
    },
    Contacted: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      dot: 'bg-amber-500',
    },
    Qualified: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    Lost: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      dot: 'bg-rose-500',
    },
  };

  const current = config[status] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}
