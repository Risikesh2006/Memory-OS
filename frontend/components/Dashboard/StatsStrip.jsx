'use client';

const stats = [
  { icon: '📸', label: 'Photos', value: 198 },
  { icon: '🎥', label: 'Videos', value: 53 },
  { icon: '📝', label: 'Journals', value: 102 },
  { icon: '🏆', label: 'Milestones', value: 74 },
  { icon: '📦', label: 'Collections', value: 18 },
  { icon: '🔥', label: 'Streak', value: '12 days' },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 my-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl px-4 py-3 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-default"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div className="text-[18px] leading-none mb-1">{s.icon}</div>
          <div className="text-[20px] font-bold text-[#1A1A2E] tabular-nums leading-tight">{s.value}</div>
          <div className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
