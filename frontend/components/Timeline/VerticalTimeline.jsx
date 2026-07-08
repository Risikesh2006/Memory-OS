'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import TimelineCard from './TimelineCard';

export default function VerticalTimeline({ items }) {
  const containerRef = useRef(null);
  const [groupedItems, setGroupedItems] = useState([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Group items by Year and Month
    const grouped = [];
    let currentYear = null;
    let currentMonth = null;
    let yearGroup = null;
    let monthGroup = null;

    items.forEach(item => {
      const date = new Date(item.date || item.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });

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

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8" ref={containerRef}>
      {/* Animated Center Line */}
      <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-los-border -translate-x-1/2">
        <motion.div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-los-accent via-los-cyan to-transparent origin-top"
          style={{ scaleY, height: '100%' }}
        />
      </div>

      <div className="space-y-24">
        {groupedItems.map((yearGroup, yearIndex) => (
          <div key={yearGroup.year} className="relative z-10">
            {/* Year Marker */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="sticky top-40 mx-auto w-max mb-16 z-20"
            >
              <div className="px-6 py-2 rounded-full bg-los-bg-tertiary border border-los-border shadow-[0_0_20px_rgba(124,58,237,0.2)] glass-blur">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-los-accent-light to-los-cyan">
                  {yearGroup.year}
                </span>
              </div>
            </motion.div>

            <div className="space-y-16">
              {yearGroup.months.map((monthGroup, monthIndex) => (
                <div key={monthGroup.month} className="relative">
                  {/* Month Marker */}
                  <div className="flex items-center md:justify-center mb-8 pl-12 md:pl-0 relative z-10">
                    <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-los-bg border-4 border-los-accent -translate-x-1/2 z-10" />
                    <span className="text-lg font-semibold text-los-text-secondary uppercase tracking-widest bg-los-bg px-4">
                      {monthGroup.month}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-12">
                    {monthGroup.items.map((item, itemIndex) => {
                      // Alternate sides on desktop, always right on mobile
                      const isLeft = itemIndex % 2 === 0;
                      
                      return (
                        <div key={item.id} className="relative flex flex-col md:flex-row items-center w-full group">
                          {/* Point on timeline */}
                          <div className="absolute left-[20px] md:left-1/2 w-6 h-6 rounded-full bg-los-bg border-2 border-los-border -translate-x-1/2 z-10 group-hover:border-los-accent transition-colors duration-300 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-los-text-muted group-hover:bg-los-accent-light transition-colors duration-300 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                          </div>

                          {/* Content Container */}
                          <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-16 md:text-right flex md:justify-end' : 'md:pl-16 flex md:justify-start md:ml-auto'}`}>
                            <motion.div 
                              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                              className="w-full max-w-[450px]"
                            >
                              <TimelineCard item={item} align={isLeft ? 'right' : 'left'} />
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
