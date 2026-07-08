'use client';
import { Search, SlidersHorizontal, ChevronDown, FileOutput, MoreVertical } from 'lucide-react';

export default function WelcomeHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="mb-6">
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <h1 className="text-[36px] font-bold text-[#1A1A2E] leading-tight tracking-tight">
          {greeting}, Risikesh!
        </h1>
        <button className="flex items-center gap-2 bg-[#1A1A2E] text-white px-5 py-2.5 rounded-full text-[14px] font-medium hover:bg-black transition-colors shadow-sm whitespace-nowrap">
          <span className="text-lg leading-none">+</span> Add Memory
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3.5 py-1.5 text-[13px] text-[#374151] font-medium hover:bg-gray-50 transition-colors bg-white">
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3.5 py-1.5 text-[13px] text-[#374151] font-medium hover:bg-gray-50 transition-colors bg-white">
            <ChevronDown size={13} /> Last 30 days
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3.5 py-1.5 text-[13px] text-[#374151] font-medium hover:bg-gray-50 transition-colors bg-white">
            <FileOutput size={13} /> Export
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 w-48">
            <Search size={13} className="text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-[13px] text-[#374151] placeholder-[#9CA3AF] outline-none w-full"
            />
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 bg-white transition-colors text-[#6B7280]">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
