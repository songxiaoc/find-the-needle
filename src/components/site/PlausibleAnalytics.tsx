'use client';

import { useState } from 'react';
import Script from 'next/script';

import { analyticsConfig } from '@/config/analytics';

export function PlausibleAnalytics() {
  const [gameradarReady, setGameradarReady] = useState(
    !analyticsConfig.gameradarPlausibleScriptUrl
  );

  return (
    <>
      {analyticsConfig.gameradarPlausibleScriptUrl && (
        <Script
          id="gameradar-plausible"
          async
          src={analyticsConfig.gameradarPlausibleScriptUrl}
          strategy="afterInteractive"
          onReady={() => setGameradarReady(true)}
          onError={() => setGameradarReady(true)}
        />
      )}
      {/* The newer tracker skips initialization if the legacy tracker runs first. */}
      {gameradarReady && analyticsConfig.plausibleDomain && (
        <Script
          id="plausible"
          defer
          data-domain={analyticsConfig.plausibleDomain}
          src={analyticsConfig.plausibleScriptUrl}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
