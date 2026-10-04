import { gameConfig } from './game';

export const analyticsConfig = {
  gameradarPlausibleScriptUrl:
    process.env.NEXT_PUBLIC_GAMERADAR_PLAUSIBLE_SCRIPT_URL ??
    'https://pl.gameradar.online/js/pa-yWxKMqEauP6VJdZECyZzi.js',
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'G-CM2SYQF9MT',
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_ID ?? gameConfig.domain,
  plausibleScriptUrl:
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
    'https://plausible.shipsolo.io/js/script.js',
};
