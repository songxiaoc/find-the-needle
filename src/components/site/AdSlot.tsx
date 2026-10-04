'use client';

import { useEffect, useRef, useState } from 'react';

import { adsterraConfig, type BannerUnit } from '@/config/advertising';

import styles from './AdSlot.module.css';

function bannerDocument(unit: BannerUnit) {
  const options = {
    key: unit.key,
    format: 'iframe',
    height: unit.height,
    width: unit.width,
    params: {},
  };

  // Each document has its own atOptions and supports parser-time document.write.
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;overflow:hidden"><script>atOptions=${JSON.stringify(options)};</script><script src="${adsterraConfig.bannerScriptOrigin}/${unit.key}/invoke.js"></script></body></html>`;
}

export function AdSlot({
  variant = 'rectangle',
  label = 'Advertisement',
  className = '',
}: {
  variant?: 'rectangle' | 'leaderboard';
  label?: string;
  className?: string;
}) {
  const slot = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState<BannerUnit | null>(null);

  useEffect(() => {
    const element = slot.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const candidates =
        variant === 'leaderboard'
          ? [adsterraConfig.banners.desktop, adsterraConfig.banners.mobile]
          : [adsterraConfig.banners.rectangle];
      setUnit(candidates.find((candidate) => candidate.width <= width) ?? null);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <aside
      aria-label={label}
      className={`${styles.slot} ${className}`}
      data-ad-placement={variant}
    >
      <p className="text-site-outline mb-2 text-center text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <div ref={slot} className={styles.container}>
        <div
          className={
            variant === 'leaderboard' ? styles.leaderboard : styles.rectangle
          }
        >
          {unit && (
            <iframe
              key={unit.key}
              title={`${label} ${unit.width} × ${unit.height}`}
              width={unit.width}
              height={unit.height}
              srcDoc={bannerDocument(unit)}
              scrolling="no"
              className="block border-0"
            />
          )}
        </div>
      </div>
    </aside>
  );
}
