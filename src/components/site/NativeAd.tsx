'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { adsterraConfig } from '@/config/advertising';

function NativeAdContent({ label }: { label: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    // Keep provider-managed children outside React's reconciliation tree.
    const container = document.createElement('div');
    container.id = adsterraConfig.native.containerId;
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = adsterraConfig.native.scriptUrl;
    element.append(container, script);

    return () => element.replaceChildren();
  }, []);

  return (
    <aside aria-label={label} data-ad-placement="native">
      <p className="text-site-outline mb-2 text-center text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <div ref={host} className="min-h-[250px]" />
    </aside>
  );
}

export function NativeAd({ label }: { label: string }) {
  const pathname = usePathname();
  return <NativeAdContent key={pathname} label={label} />;
}
