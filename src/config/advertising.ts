export type BannerUnit = {
  key: string;
  width: number;
  height: number;
};

export const adsterraConfig = {
  bannerScriptOrigin: 'https://www.highrevenueformat.com',
  banners: {
    rectangle: {
      key: 'f9aa78f5eda0bc277ccd5a305c995fce',
      width: 300,
      height: 250,
    },
    mobile: {
      key: 'b7e862099e73dbac07fbc74784b92cbd',
      width: 320,
      height: 50,
    },
    desktop: {
      key: '1a6d9651cae24f7865854c00ea0dae1b',
      width: 728,
      height: 90,
    },
  },
  native: {
    containerId: 'container-ab2c6dbbc970524fd762cac0d0d4c68e',
    scriptUrl:
      'https://pl31652628.profitableratecpmnetwork.com/ab2c6dbbc970524fd762cac0d0d4c68e/invoke.js',
  },
  socialBarScriptUrl:
    'https://pl31652629.profitableratecpmnetwork.com/95/cc/a6/95cca6e3a4d93a7cba86e9c99da47078.js',
} as const;

const ADVERTISEMENT_LABELS: Record<string, string> = {
  en: 'Advertisement',
  de: 'Werbung',
  es: 'Publicidad',
  fr: 'Publicité',
  ru: 'Реклама',
};

export function advertisementLabel(locale: string) {
  return ADVERTISEMENT_LABELS[locale] ?? ADVERTISEMENT_LABELS.en;
}
