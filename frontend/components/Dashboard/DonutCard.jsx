'use client';

// Custom SVG donut/gauge chart
const SEGMENTS = [
  { label: 'Available', value: 55, color: '#EF4444' },   // Red
  { label: 'Milestones', value: 25, color: '#F59E0B' },  // Yellow/Amber
  { label: 'Collections', value: 20, color: '#7C3AED' }, // Purple
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

export default function DonutCard() {
  const total = SEGMENTS.reduce((s, seg) => s + seg.value, 0);

  // Map to 270-degree arc (from -135 to 135 degrees)
  const arcRange = 260;
  const startOffset = -130;

  let cumulative = 0;
  const arcs = SEGMENTS.map((seg) => {
    const start = startOffset + (cumulative / total) * arcRange;
    cumulative += seg.value;
    const end = startOffset + (cumulative / total) * arcRange;
    return { ...seg, start, end };
  });

  const cx = 100, cy = 100, r = 72, strokeWidth = 14;

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Chart Area */}
      <div className="flex justify-center items-center relative" style={{ height: 200 }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          {/* Track */}
          <path
            d={describeArc(cx, cy, r, startOffset, startOffset + arcRange)}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Colored arcs */}
          {arcs.map((seg, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, seg.start + 1, seg.end - 1)}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[28px] font-bold text-[#1A1A2E] tabular-nums leading-tight">247</div>
          <div className="text-[12px] text-[#1A1A2E] font-semibold">Active</div>
          <div className="text-[11px] text-[#6B7280]">Memories</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 flex-wrap">
        {SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-[12px] text-[#6B7280] font-medium">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
