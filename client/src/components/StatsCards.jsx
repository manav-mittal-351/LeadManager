import { Users, Sparkles, PhoneCall, CheckCircle2, XCircle } from 'lucide-react';

export default function StatsCards({ stats, activeStatus, onSelectStatus }) {
  const cards = [
    {
      id: 'All',
      label: 'Total Leads',
      count: stats?.total ?? 0,
      icon: Users,
      bgColor: 'bg-white',
      accentColor: 'text-indigo-600',
      activeRing: 'ring-2 ring-indigo-500 bg-indigo-50/40',
      borderColor: 'border-slate-200',
    },
    {
      id: 'New',
      label: 'New',
      count: stats?.new ?? 0,
      icon: Sparkles,
      bgColor: 'bg-white',
      accentColor: 'text-blue-600',
      activeRing: 'ring-2 ring-blue-500 bg-blue-50/40',
      borderColor: 'border-blue-100',
    },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: stats?.contacted ?? 0,
      icon: PhoneCall,
      bgColor: 'bg-white',
      accentColor: 'text-amber-600',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/40',
      borderColor: 'border-amber-100',
    },
    {
      id: 'Qualified',
      label: 'Qualified',
      count: stats?.qualified ?? 0,
      icon: CheckCircle2,
      bgColor: 'bg-white',
      accentColor: 'text-emerald-600',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/40',
      borderColor: 'border-emerald-100',
    },
    {
      id: 'Lost',
      label: 'Lost',
      count: stats?.lost ?? 0,
      icon: XCircle,
      bgColor: 'bg-white',
      accentColor: 'text-rose-600',
      activeRing: 'ring-2 ring-rose-500 bg-rose-50/40',
      borderColor: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
              isActive ? card.activeRing : `${card.bgColor} ${card.borderColor} hover:border-slate-300 shadow-xs`
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.accentColor}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.count}
              </span>
              {isActive && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                  Active
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
