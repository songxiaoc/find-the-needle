import { gameConfig } from './game';

export const analyticsConfig = {
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'G-CM2SYQF9MT',
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_ID ?? gameConfig.domain,
  plausibleScriptUrl:
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
    'https://plausible.shipsolo.io/js/script.js',
};
