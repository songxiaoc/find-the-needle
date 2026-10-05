type ThemeCopy = {
  toggle: string;
  light: string;
  dark: string;
};

const copy: Record<string, ThemeCopy> = {
  en: {
    toggle: 'Toggle color theme',
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
  },
  fr: {
    toggle: 'Changer de thème',
    light: 'Passer au thème clair',
    dark: 'Passer au thème sombre',
  },
  de: {
    toggle: 'Farbschema wechseln',
    light: 'Zum hellen Design wechseln',
    dark: 'Zum dunklen Design wechseln',
  },
  es: {
    toggle: 'Cambiar tema',
    light: 'Cambiar al tema claro',
    dark: 'Cambiar al tema oscuro',
  },
  ru: {
    toggle: 'Переключить тему',
    light: 'Включить светлую тему',
    dark: 'Включить тёмную тему',
  },
  zh: {
    toggle: '切换配色',
    light: '切换为浅色',
    dark: '切换为深色',
  },
};

export function getThemeCopy(locale = 'en'): ThemeCopy {
  return copy[locale] ?? copy.en;
}
