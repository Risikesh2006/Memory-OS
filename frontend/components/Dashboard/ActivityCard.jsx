'use client';
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const barData = [
  { month: 'Apr', value: 62 },
  { month: 'May', value: 43, badge: '+10%' },
  { month: 'Jun', value: 89 },
];

// GitHub-style heatmap data
const heatmapData = Array.from({ length: 35 }, (_, i) => ({
  level: Math.floor(Math.random() * 5),
}));

const heatColors = ['#F0F9EC', '#C6EFBB', '#7DC87C', '#3EAE3E', '#22C55E'];

const CustomBar = (props) => {
  const { x, y, width, height, fill, badge } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />
      {badge && (
        <g>
          <rect x={x + width / 2 - 18} y={y - 22} width={36} height={18} rx={9} fill="#7C3AED" />
          <text x={x + width / 2} y={y - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">{badge}</text>
        </g>
      )}
    </g>
  );
};

export default function ActivityCard() {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[15px] text-[#1A1A2E]">Memory Activity</span>
        <button className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1A1A2E] font-medium transition-colors">
          View all <span className="ml-0.5">›</span>
        </button>
      </div>

      {/* Big stat */}
      <div>
        <div className="text-[42px] font-bold text-[#1A1A2E] leading-none tabular-nums">127</div>
        <div className="text-[13px] text-[#6B7280] mt-1">Uploads this month</div>
      </div>

      {/* Bar Chart */}
      <div className="h-[110px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barSize={44} margin={{ top: 28, right: 8, left: 8, bottom: 0 }}>
            <Tooltip
              cursor={false}
              contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: 8, color: 'white', fontSize: 12 }}
              formatter={(v) => [`${v} uploads`]}
            />
            <Bar dataKey="value" radius={[6, 6, 6, 6]}
              shape={(props) => {
                const item = barData[props.index];
                return <CustomBar {...props} fill={props.index === 0 ? '#1A1A2E' : '#7C3AED'} badge={item.badge} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
        {/* Labels */}
        <div className="flex justify-around text-[11px] text-[#9CA3AF] font-medium -mt-1">
          {barData.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Activity Heatmap</div>
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {heatmapData.map((d, i) => (
            <div
              key={i}
              className="rounded-[3px] aspect-square"
              style={{ backgroundColor: heatColors[d.level] }}
              title={`${d.level} memories`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
