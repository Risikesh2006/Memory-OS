'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TimelineCard from './TimelineCard';

export default function HorizontalTimeline({ items }) {
  const scrollRef = useRef(null);
  const [groupedItems, setGroupedItems] = useState([]);
  
  useEffect(() => {
    // Group items by Year and Month
    const grouped = [];
    let currentYear = null;
    let currentMonth = null;
    let yearGroup = null;
    let monthGroup = null;

    // Items should be sorted oldest to newest for horizontal scroll
    const sortedItems = [...items].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

    sortedItems.forEach(item => {
      const date = new Date(item.date || item.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });

      if (year !== currentYear) {
        currentYear = year;
        yearGroup = { year, months: [] };
        grouped.push(yearGroup);
        currentMonth = null;
      }

      if (month !== currentMonth) {
        currentMonth = month;
        monthGroup = { month, items: [] };
        yearGroup.months.push(monthGroup);
      }

      monthGroup.items.push(item);
    });

    setGroupedItems(grouped);
  }, [items]);

  // Handle wheel scroll to scroll horizontally
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollRef.current && e.deltaY !== 0) {
        // Prevent default vertical scroll and scroll horizontally instead
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };
    
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-los-bg-secondary rounded-2xl border border-los-border overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Central Timeline Axis */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-los-border -translate-y-1/2 z-0" />
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-los-accent/50 to-transparent -translate-y-1/2 z-0 animate-pulse" />

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center h-full px-[50vw] min-w-max pb-10">
          {groupedItems.map((yearGroup, yIndex) => (
            <div key={yearGroup.year} className="flex h-full relative">
              
              {/* Year Marker */}
              <div className="absolute top-10 left-0 text-6xl font-black text-white/5 pointer-events-none select-none z-0">
                {yearGroup.year}
              </div>

              {yearGroup.months.map((monthGroup, mIndex) => (
                <div key={`${yearGroup.year}-${monthGroup.month}`} className="flex items-center px-12 relative h-full">
                  
                  {/* Month Node */}
                  <div className="absolute top-1/2 left-0 w-max -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-los-text-muted uppercase tracking-widest">{monthGroup.month}</span>
                    <div className="w-4 h-4 rounded-full bg-los-bg border-4 border-los-accent shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                  </div>

                  {/* Items for this month */}
                  <div className="flex gap-8 relative z-20">
                    {monthGroup.items.map((item, iIndex) => {
                      // Alternate top and bottom positioning
                      const isTop = iIndex % 2 === 0;
                      
                      return (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "0px 100px 0px 100px" }}
                          transition={{ duration: 0.4 }}
                          className={`relative flex flex-col justify-center w-[300px] h-full`}
                        >
                          {/* Connector Line */}
                          <div 
                            className={`absolute left-1/2 w-[2px] bg-los-border/50 -translate-x-1/2 ${
                              isTop 
                                ? 'bottom-1/2 h-[150px] bg-gradient-to-t from-los-border/50 to-transparent' 
                                : 'top-1/2 h-[150px] bg-gradient-to-b from-los-border/50 to-transparent'
                            }`} 
                          />
                          
                          {/* Item Node */}
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-los-text-secondary -translate-x-1/2 -translate-y-1/2 z-10" />

                          {/* Card Position */}
                          <div className={`w-full absolute ${isTop ? 'bottom-[calc(50%+40px)]' : 'top-[calc(50%+40px)]'}`}>
                            <TimelineCard item={item} compact />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-los-bg/80 glass-blur rounded-full border border-los-border text-xs text-los-text-muted flex items-center gap-2 pointer-events-none">
        <span>Scroll or drag horizontally</span>
        <span className="w-16 h-1 bg-los-border rounded-full overflow-hidden flex">
          <motion.span 
            className="w-1/3 h-full bg-los-text-muted rounded-full"
            animate={{ x: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </div>
  );
}
