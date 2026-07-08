'use client';
import { useState } from 'react';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';

const rows = [
  { label: 'Photos', value: 198, expandable: false, indent: false },
  { label: 'Videos', value: 53, expandable: true, expanded: true, indent: false },
  { label: 'Journals', value: 102, expandable: false, indent: true },
  { label: 'Milestones', value: 74, expandable: false, indent: true },
  { label: 'Collections', value: 18, expandable: false, indent: true },
];

export default function CollectionsCard() {
  const [expanded, setExpanded] = useState({ Videos: true });

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[15px] text-[#1A1A2E]">My Collections</span>
        <button className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 text-[12px] text-[#374151] font-medium hover:bg-gray-50 transition-colors">
          <Plus size={11} /> New Collection
        </button>
      </div>

      {/* Purple Credit Card */}
      <div className="relative rounded-2xl overflow-hidden p-5 text-white" style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        minHeight: 140
      }}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
        <div className="absolute top-4 -right-4 w-20 h-20 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.5)"/>
                <circle cx="14" cy="8" r="7" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
              <path d="M2 2h7l3 16h3l3-16h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
            </svg>
          </div>

          <div className="mb-4">
            <div className="text-[11px] font-medium opacity-70 mb-1">COLLECTION</div>
            <div className="text-[17px] font-bold tracking-wide">🎓 College Life</div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-mono opacity-70 tracking-widest">••••2024 &nbsp; •••2026</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-60 font-medium">Exp.</div>
              <div className="text-[13px] font-mono font-semibold">06/28</div>
            </div>
          </div>
        </div>

        {/* Memory count pill */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
          427 memories
        </div>
      </div>

      {/* Life Progress */}
      <div className="flex items-center justify-between py-1 border-b border-gray-100">
        <span className="text-[13px] text-[#6B7280] font-medium">Life Progress</span>
        <span className="text-[15px] font-bold text-[#1A1A2E] tabular-nums">427 Memories</span>
      </div>

      {/* Expandable Rows */}
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.label}
            className={`flex items-center justify-between py-1.5 px-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${row.indent ? 'pl-6' : ''}`}
            onClick={() => row.expandable && setExpanded(p => ({ ...p, [row.label]: !p[row.label] }))}>
            <div className="flex items-center gap-2">
              {row.expandable ? (
                expanded[row.label]
                  ? <ChevronDown size={13} className="text-[#6B7280]" />
                  : <ChevronRight size={13} className="text-[#6B7280]" />
              ) : (
                <div className="w-[13px]"></div>
              )}
              <span className={`text-[13px] ${row.indent ? 'text-[#6B7280]' : 'font-medium text-[#374151]'}`}>
                {row.label}
              </span>
            </div>
            <span className={`text-[13px] tabular-nums ${row.indent ? 'text-[#6B7280]' : 'font-semibold text-[#1A1A2E]'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
