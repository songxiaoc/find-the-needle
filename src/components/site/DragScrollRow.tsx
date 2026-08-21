'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** CSS color of the surface the row sits on — used for edge fade. Defaults to --site-surface. */
  fadeColor?: string;
};

/**
 * Horizontal scroll row with mouse drag-to-scroll.
 * Touch devices use native horizontal scrolling.
 * Edge fade masks hint at more content on either side.
 */
export function DragScrollRow({
  children,
  className,
  fadeColor = 'var(--site-surface)',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      left: scrollLeft > 4,
      right: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only mouse drag — let touch use native scroll.
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    // NOTE: do NOT setPointerCapture here. While an element holds pointer
    // capture, the browser retargets the trailing `click` event to the
    // capturing element instead of the link under the cursor, so a plain
    // click on a card never reaches its <Link> and navigation silently
    // fails. Capture is acquired lazily in onPointerMove, only once a real
    // drag is detected.
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 10 && !s.moved) {
      s.moved = true;
      // Now that this is a genuine drag, capture the pointer so scrolling
      // keeps tracking even if the cursor leaves the row.
      el.setPointerCapture(e.pointerId);
    }
    if (s.moved) el.scrollLeft = s.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    s.moved = false;
    const el = ref.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  };

  // Suppress click after drag so cards don't navigate when user drags.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (s.moved) {
      e.preventDefault();
      e.stopPropagation();
      s.moved = false;
    }
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onScroll={updateEdges}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1"
        style={{
          cursor: dragState.current.active ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {edges.left && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12"
          style={{
            background: `linear-gradient(to right, ${fadeColor}, transparent)`,
          }}
        />
      )}
      {edges.right && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16"
          style={{
            background: `linear-gradient(to left, ${fadeColor}, transparent)`,
          }}
        />
      )}
    </div>
  );
}
