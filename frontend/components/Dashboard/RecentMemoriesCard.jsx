'use client';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const lineData = [
  { day: 'May 1', memories: 4 },
  { day: 'May 8', memories: 6 },
  { day: 'May 15', memories: 5 },
  { day: 'May 22', memories: 9 },
  { day: 'May 28', memories: 11 },
  { day: 'Jun 1', memories: 14 },
  { day: 'Jun 5', memories: 24 },
];

const CustomDot = (props) => {
  const { cx, cy, index } = props;
  if (index !== lineData.length - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#7C3AED" stroke="white" strokeWidth={2} />
      <rect x={cx - 20} y={cy - 26} width={42} height={18} rx={9} fill="#1A1A2E" />
      <text x={cx + 1} y={cy - 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">Jun 5</text>
    </g>
  );
};

export default function RecentMemoriesCard() {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[15px] text-[#1A1A2E]">Recent Memories</span>
        <button className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 text-[12px] text-[#374151] font-medium hover:bg-gray-50 transition-colors">
          Past 30 days <span className="ml-0.5 text-[10px]">↓</span>
        </button>
      </div>

      {/* Big number + badge */}
      <div className="flex items-end gap-3">
        <div className="text-[42px] font-bold text-[#1A1A2E] leading-none tabular-nums">24</div>
        <div className="mb-1.5 flex flex-col gap-0.5">
          <div className="text-[13px] text-[#6B7280]">Added this month</div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full w-fit">
            <TrendingUp size={11} strokeWidth={2.5} />
            <span className="text-[11px] font-semibold">16.4%</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-[110px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={lineData} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={{ stroke: '#7C3AED', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: 8, color: 'white', fontSize: 12 }}
              formatter={(v) => [`${v} memories`]}
            />
            <Area
              type="monotone"
              dataKey="memories"
              stroke="#7C3AED"
              strokeWidth={2.5}
              fill="url(#memGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#7C3AED', stroke: 'white', strokeWidth: 2 }}
            />
            {/* Custom dot at last point */}
            <Area
              type="monotone"
              dataKey="memories"
              stroke="none"
              fill="none"
              dot={<CustomDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
