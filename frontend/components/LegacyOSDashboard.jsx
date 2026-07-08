'use client';

import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Flame,
  Image,
  Layers3,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trophy,
  Video,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const activityData = [
  { label: 'Mon', value: 62, accent: 28 },
  { label: 'Tue', value: 43, accent: 38 },
  { label: 'Wed', value: 89, accent: 49 },
];

const heatmapRows = [
  [0, 1, 0, 2, 1, 0, 1],
  [1, 2, 1, 3, 2, 1, 2],
  [0, 1, 2, 4, 3, 1, 0],
  [1, 3, 2, 4, 4, 2, 1],
  [0, 1, 0, 2, 3, 1, 0],
];

const recentData = [
  { label: 'May 28', value: 9 },
  { label: 'May 30', value: 11 },
  { label: 'Jun 1', value: 15 },
  { label: 'Jun 3', value: 18 },
  { label: 'Jun 5', value: 24 },
];

const onThisDayData = [
  { label: 'Y1', value: 12 },
  { label: 'Y2', value: 18 },
  { label: 'Y3', value: 32 },
  { label: 'Jun 5', value: 26 },
];

const stats = [
  { icon: Image, label: 'Photos', value: '198' },
  { icon: Video, label: 'Videos', value: '53' },
  { icon: BookOpen, label: 'Journals', value: '102' },
  { icon: Trophy, label: 'Milestones', value: '74' },
  { icon: Layers3, label: 'Collections', value: '18' },
  { icon: Flame, label: 'Streak', value: '12 days' },
];

const collectionRows = [
  { label: 'Photos', value: '198', open: true },
  { label: 'Videos', value: '53', open: false },
  { label: 'Journals', value: '102', open: false },
  { label: 'Milestones', value: '74', open: false },
  { label: 'Collections', value: '18', open: false },
];

const heatmapPalette = ['#E9F5E1', '#C9EEBA', '#9BE37A', '#5ACB55', '#22C55E'];

function LogoMark() {
  return (
    <div className="relative h-10 w-10">
      <span className="absolute left-0 top-1 h-8 w-8 rounded-full border-[3px] border-black/90" />
      <span className="absolute right-0 top-1 h-8 w-8 rounded-full border-[3px] border-black/90" />
    </div>
  );
}

function SectionHeader({ title, action, actionIcon: ActionIcon, tone = 'light' }) {
  const titleClass = tone === 'dark' ? 'text-white' : 'text-[var(--text)]';
  const actionClass = tone === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-800';

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className={`text-[1.15rem] font-medium ${titleClass}`}>{title}</h2>
      {action ? (
        <button type="button" className={`inline-flex items-center gap-1 text-sm font-medium ${actionClass}`}>
          <span>{action}</span>
          {ActionIcon ? <ActionIcon size={14} /> : null}
        </button>
      ) : null}
    </div>
  );
}

function DonutGauge() {
  const size = 230;
  const strokeWidth = 18;
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { value: 42, color: '#F97316' },
    { value: 30, color: '#FACC15' },
    { value: 28, color: '#7C3AED' },
  ];

  let offset = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto block h-[230px] w-[230px]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((segment) => {
          const length = (segment.value / 100) * circumference;
          const currentOffset = -offset;
          offset += length;

          return (
            <circle
              key={segment.color}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={currentOffset}
            />
          );
        })}
      </g>
    </svg>
  );
}

function Heatmap() {
  return (
    <div className="mt-5 grid grid-cols-7 gap-1">
      {heatmapRows.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <span
            key={`${rowIndex}-${cellIndex}`}
            className="h-[10px] w-[10px] rounded-[3px]"
            style={{ backgroundColor: heatmapPalette[cell] }}
          />
        )),
      )}
    </div>
  );
}

function NavPill({ children, active = false }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-black text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="legacy-micro-card flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-[var(--text)] tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function CollectionsCard() {
  return (
    <div className="legacy-card p-5">
      <SectionHeader title="My Collections" action="+ New Collection" />

      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-5 text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)]">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm/none text-white/80">Collection</p>
            <h3 className="mt-2 text-2xl font-semibold">College Life</h3>
            <p className="mt-1 text-sm text-white/80">427 memories</p>
          </div>
          <div className="text-right text-xs tracking-[0.28em] text-white/70">
            <p>••••2024</p>
            <p className="mt-3">••••2026</p>
          </div>
        </div>
        <div className="flex items-end justify-between text-sm text-white/85">
          <div className="flex gap-2 text-white">
            <span className="h-3 w-3 rounded-full bg-white/90" />
            <span className="h-3 w-3 rounded-full bg-white/55" />
          </div>
          <p className="font-medium">Exp: 06/28</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Life Progress</p>
          <p className="text-lg font-semibold text-[var(--text)] tabular-nums">$16,531</p>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
          <span>427 Memories</span>
          <span>100% archived</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {collectionRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl px-1 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{row.open ? '▼' : '▶'}</span>
              <span className="font-medium text-slate-700">{row.label}</span>
            </div>
            <span className="font-semibold text-[var(--text)] tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityCard() {
  return (
    <div className="legacy-card p-5">
      <SectionHeader title="Memory Activity" action="View all" actionIcon={ChevronRight} />

      <div className="rounded-2xl bg-slate-50 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-semibold tracking-tight text-[var(--text)] tabular-nums">127</p>
            <p className="mt-2 text-sm text-slate-500">Uploads this month</p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">+10%</span>
        </div>

        <div className="mt-6 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} barCategoryGap="22%">
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis hide />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#111827" />
              <Bar dataKey="accent" radius={[12, 12, 0, 0]} fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_#EEF2F7]">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p className="font-medium text-[var(--text)]">Activity Heatmap</p>
            <p>Last 30 days</p>
          </div>
          <Heatmap />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function DonutCard() {
  return (
    <div className="legacy-card p-5">
      <SectionHeader title="Memory Allocation" />

      <div className="flex items-center justify-center">
        <div className="relative">
          <DonutGauge />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[2.75rem] font-semibold tracking-tight text-[var(--text)] tabular-nums">$4,682</p>
            <p className="mt-1 text-sm text-slate-500">247 Active</p>
            <p className="text-sm text-slate-500">Memories</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 text-sm text-slate-500">
        <LegendDot color="#F97316" label="Available" />
        <LegendDot color="#FACC15" label="Milestones" />
        <LegendDot color="#7C3AED" label="Collections" />
      </div>
    </div>
  );
}

function RecentMemoriesCard() {
  return (
    <div className="legacy-card p-5">
      <SectionHeader title="Recent Memories" action="Past 30 days" actionIcon={ChevronDown} />

      <div className="flex items-end justify-between gap-4 rounded-2xl bg-slate-50 p-5">
        <div>
          <p className="text-5xl font-semibold tracking-tight text-[var(--text)] tabular-nums">24</p>
          <p className="mt-2 text-sm text-slate-500">Added this month</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">▲ 16.4%</span>
      </div>

      <div className="mt-5 h-64 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_#EEF2F7]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recentData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#EEF2F7" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis hide domain={[0, 28]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{ r: 5, stroke: '#7C3AED', strokeWidth: 3, fill: '#FFFFFF' }}
              activeDot={{ r: 7 }}
            />
            <ReferenceDot x="Jun 5" y={24} r={6} fill="#7C3AED" stroke="#ffffff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OnThisDayCard() {
  return (
    <div className="legacy-card overflow-hidden bg-gradient-to-br from-violet-600 to-violet-700 p-5 text-white">
      <SectionHeader title="On This Day" action="Past years" actionIcon={ChevronDown} tone="dark" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-semibold tracking-tight tabular-nums">3</p>
          <p className="mt-2 text-sm text-white/80">Years ago</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">Jun 5</span>
      </div>

      <p className="mt-6 max-w-xs text-sm leading-6 text-white/90">▼ You attended your first Hackathon</p>

      <div className="mt-4 h-48 rounded-2xl bg-white/5 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={onThisDayData} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, 38]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2, fill: '#7C3AED' }}
            />
            <ReferenceDot x="Jun 5" y={26} r={5} fill="#FFFFFF" stroke="#7C3AED" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function LegacyOSDashboard() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight text-[var(--text)]">Legacy OS</span>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <NavPill>Collections</NavPill>
            <NavPill active>Dashboard</NavPill>
            <NavPill>Timeline</NavPill>
            <NavPill>Journal</NavPill>
            <NavPill>Memories</NavPill>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Settings size={18} />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Bell size={18} />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white shadow-sm">
              RK
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[2.25rem] font-bold tracking-tight text-[var(--text)] sm:text-[2.5rem]">Good Evening, Risikesh!</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" className="legacy-pill-outline">
                <Filter size={16} /> Filter
              </button>
              <button type="button" className="legacy-pill-outline">
                <ChevronDown size={16} /> Last 30 days
              </button>
              <button type="button" className="legacy-pill-outline">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:max-w-xl lg:flex-row lg:items-center lg:justify-end">
            <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 shadow-sm lg:max-w-md">
              <Search size={18} className="shrink-0" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
              />
            </div>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
              <MoreVertical size={18} />
            </button>
            <button type="button" className="legacy-pill-black h-12 whitespace-nowrap px-5 text-sm">
              <Plus size={16} /> Add Memory
            </button>
          </div>
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <CollectionsCard />
          <ActivityCard />
          <DonutCard />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <RecentMemoriesCard />
          <OnThisDayCard />
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {stats.map((item) => (
            <StatCard key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </section>
      </main>
    </div>
  );
}
