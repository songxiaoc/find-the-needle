'use client';

import { useEffect } from 'react';

import { adsterraConfig } from '@/config/advertising';

let nativeObserver: MutationObserver | undefined;

export function NativeAdRuntime() {
  useEffect(() => {
    if (nativeObserver) return;

    // The provider skips a placement key after its first initialization.
    // Keep one runtime per document, including locale layout remounts.
    const wrapper = document.createElement('div');
    const container = document.createElement('div');
    container.id = adsterraConfig.native.containerId;
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = adsterraConfig.native.scriptUrl;
    wrapper.append(container);

    const placeAd = () => {
      const host = document.querySelector('[data-ad-native-host]');
      if (host && wrapper.parentNode !== host) host.append(wrapper);
    };
    placeAd();
    wrapper.append(script);

    nativeObserver = new MutationObserver(placeAd);
    nativeObserver.observe(document.body, { childList: true, subtree: true });
  }, []);

  return null;
}

export function NativeAd({ label }: { label: string }) {
  return (
    <aside aria-label={label} data-ad-placement="native">
      <p className="text-site-outline mb-2 text-center text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <div data-ad-native-host className="min-h-[250px]" />
    </aside>
  );
}
