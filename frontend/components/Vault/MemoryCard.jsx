'use client';

import { memo, useEffect, useRef } from 'react';
import { Calendar, File, FileText, Image, Music, Tag, Video } from 'lucide-react';

function MemoryCard({
  memory,
  position,
  isFiltered,
  isActive,
  onSelect,
  onOpen,
  onCommitPosition,
  onDragMove,
  registerCardRef,
}) {
  const cardRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    moved: false,
    suppressClick: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    nextX: 0,
    nextY: 0,
    frameId: 0,
  });

  const getIcon = () => {
    switch (memory.type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return FileText;
      case 'audio': return Music;
      default: return File;
    }
  };

  const Icon = getIcon();

  const applyPosition = (x, y, dragging = false) => {
    if (!cardRef.current) {
      return;
    }

    cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${dragging ? 1.04 : 1})`;
  };

  useEffect(() => {
    if (typeof registerCardRef === 'function') {
      registerCardRef(memory.id, cardRef.current);
    }

    return () => {
      if (typeof registerCardRef === 'function') {
        registerCardRef(memory.id, null);
      }
    };
  }, [memory.id, registerCardRef]);

  useEffect(() => {
    if (!dragStateRef.current.active) {
      applyPosition(position.x, position.y, false);
    }
  }, [position.x, position.y]);

  const finishDrag = (commitPosition = true) => {
    const dragState = dragStateRef.current;

    if (!dragState.active) {
      return;
    }

    dragState.active = false;

    if (dragState.frameId) {
      cancelAnimationFrame(dragState.frameId);
      dragState.frameId = 0;
    }

    applyPosition(dragState.nextX, dragState.nextY, false);

    if (dragState.moved) {
      dragState.suppressClick = true;
    }

    if (commitPosition) {
      onCommitPosition?.(memory.id, {
        x: dragState.nextX,
        y: dragState.nextY,
      });
    }
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const dragState = dragStateRef.current;
    dragState.active = true;
    dragState.moved = false;
    dragState.suppressClick = false;
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.originX = position.x;
    dragState.originY = position.y;
    dragState.nextX = position.x;
    dragState.nextY = position.y;

    if (cardRef.current?.setPointerCapture) {
      cardRef.current.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    dragState.nextX = dragState.originX + deltaX;
    dragState.nextY = dragState.originY + deltaY;
    dragState.moved = dragState.moved || Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;

    if (!dragState.frameId) {
      dragState.frameId = requestAnimationFrame(() => {
        dragState.frameId = 0;
        applyPosition(dragState.nextX, dragState.nextY, true);
        onDragMove?.(memory.id, {
          x: dragState.nextX,
          y: dragState.nextY,
        });
      });
    }
  };

  const handlePointerUp = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    finishDrag(true);

    if (cardRef.current?.releasePointerCapture) {
      try {
        cardRef.current.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }
    }
  };

  const handlePointerCancel = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    finishDrag(false);
  };

  const handleClick = () => {
    const dragState = dragStateRef.current;

    if (dragState.suppressClick) {
      dragState.suppressClick = false;
      return;
    }

    onSelect?.(memory);
  };

  const handleDoubleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (dragStateRef.current.suppressClick) {
      dragStateRef.current.suppressClick = false;
      return;
    }

    onOpen?.(memory, cardRef.current?.getBoundingClientRect() || null);
  };

  return (
    <div
      ref={cardRef}
      data-memory-card="true"
      className={`absolute w-[320px] cursor-grab select-none rounded-[32px] border transition-[transform,opacity,filter,box-shadow] duration-300 ease-out active:cursor-grabbing ${isActive ? 'z-30' : 'z-10'}`}
      style={{
        opacity: isFiltered ? 0.22 : 1,
        filter: isFiltered ? 'blur(4px) saturate(0.6)' : 'none',
        boxShadow: isActive
          ? '0 0 0 1px rgba(255,255,255,0.18), 0 24px 80px rgba(0,0,0,0.6)'
          : '0 18px 55px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderColor: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        willChange: 'transform, opacity, filter',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="overflow-hidden rounded-[32px]">
        <div className="relative h-48 overflow-hidden rounded-[28px] border border-white/5">
          {memory.mediaUrl ? (
            <img
              alt={memory.title}
              className="h-full w-full object-cover grayscale-[0.18] transition-all duration-700"
              src={memory.mediaUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5">
              <Icon className="h-12 w-12 text-white/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold tracking-wide text-white">{memory.title}</h4>
              <p className="mt-1 text-sm italic text-white/60 line-clamp-2">
                {memory.description || 'No description'}
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/40">
              <Icon size={14} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-white/45">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span className="text-[10px] uppercase tracking-[0.2em]">
                {memory.date || new Date(memory.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {memory.tags?.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-white/30" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {memory.tags[0]}
                </span>
              </div>
            ) : null}
          </div>

          {memory.aiSummary ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
              <p className="text-[11px] leading-relaxed text-white/55">
                AI: {memory.aiSummary}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(MemoryCard);
