'use client';

import Script from 'next/script';

import { adsterraConfig } from '@/config/advertising';

import { useAdDelay } from './useAdDelay';

export function SocialBarAd() {
  const ready = useAdDelay();

  if (!ready) return null;

  return (
    <Script
      id="adsterra-social-bar"
      src={adsterraConfig.socialBarScriptUrl}
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
