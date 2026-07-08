'use client';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const lineData = [
  { day: 'W1', val: 1 },
  { day: 'W2', val: 2 },
  { day: 'W3', val: 1.5 },
  { day: 'W4', val: 3 },
  { day: 'W5', val: 2 },
  { day: 'W6', val: 3 },
];

export default function OnThisDayCard() {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
      boxShadow: '0 2px 20px rgba(124, 58, 237, 0.35)'
    }}>
      {/* Decorative background circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-10 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-semibold text-[15px] text-white">On This Day</span>
        <button className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-[12px] text-white/90 font-medium">
          Past years <ChevronDown size={11} />
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-start gap-3">
        <div>
          <div className="text-[52px] font-bold text-white leading-none tabular-nums">3</div>
          <div className="text-[13px] text-white/70 mt-1">Years ago</div>
        </div>
        <div className="mt-2">
          <div className="bg-white/25 backdrop-blur-sm rounded-full px-3 py-1 text-[12px] font-semibold text-white inline-block mb-3">
            Jun 5
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white/70 text-[13px] mt-px">↙</span>
            <span className="text-[13px] text-white/90 font-medium leading-snug">
              You attended your<br />first Hackathon
            </span>
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="h-[64px] relative z-10 -mx-1 -mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={lineData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="onthisGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="95%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="val"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={2}
              fill="url(#onthisGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
