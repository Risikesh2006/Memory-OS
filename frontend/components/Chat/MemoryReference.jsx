'use client';

import { Calendar, Image as ImageIcon, Video, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function MemoryReference({ refData }) {
  const Icon = () => {
    switch(refData.type) {
      case 'photo': return <ImageIcon size={14} className="text-los-cyan" />;
      case 'video': return <Video size={14} className="text-los-rose" />;
      case 'journal': return <BookOpen size={14} className="text-los-accent-light" />;
      default: return <Calendar size={14} className="text-los-amber" />;
    }
  };

  const dateStr = refData.date 
    ? new Date(refData.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '';

  return (
    <Link 
      href={`/dashboard/timeline?id=${refData.id}`}
      className="inline-flex flex-col bg-los-bg-tertiary border border-los-border rounded-xl p-3 max-w-[200px] hover:border-los-accent transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="p-1.5 rounded-md bg-los-bg">
          <Icon />
        </div>
        <ExternalLink size={12} className="text-los-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {refData.url && (
        <div className="w-full h-20 rounded-md overflow-hidden mb-2">
          <img src={refData.url} alt={refData.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <p className="text-xs font-semibold text-los-text line-clamp-1 group-hover:text-los-accent-light transition-colors">
        {refData.title}
      </p>
      {dateStr && (
        <p className="text-[10px] text-los-text-muted mt-1">{dateStr}</p>
      )}
    </Link>
  );
}
