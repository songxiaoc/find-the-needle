import { additionalDiscoveryCopy } from '@/generated/additional-locales';

type DiscoveryCopy = {
  database: string;
  databaseTitle: string;
  databaseIntro: string;
  records: string;
  browse: string;
  relatedRecords: string;
  tools: string;
  toolsTitle: string;
  toolsIntro: string;
  interactive: string;
  toolCards: readonly (readonly [string, string, string])[];
  notFound: string;
};

const discoveryCopy: Record<string, DiscoveryCopy> = {
  ...additionalDiscoveryCopy,
  en: {
    database: 'Database',
    databaseTitle: 'Machines, tools and hay products',
    databaseIntro:
      'Find equipment by its job, check how it connects and follow the hay into the next stage.',
    records: 'records',
    browse: 'Browse',
    relatedRecords: 'Equipment and products in this guide',
    tools: 'Factory tools',
    toolsTitle: 'Get your production line working',
    toolsIntro:
      'Trace a stopped line, keep track of your checks and compare production using your own measurements.',
    interactive: 'Interactive',
    notFound: 'Record not found',
    toolCards: [
      [
        'Trace a factory problem',
        'Choose what you see and work through the next safe checks.',
        'LINE CHECK',
      ],
      [
        'Save your setup checklist',
        'Check connections, power and scanning routes as you build.',
        'CHECKLIST',
      ],
      [
        'Compare production lines',
        'Find bottlenecks and estimate payback from your observed rates.',
        'CALCULATOR',
      ],
    ],
  },
  fr: {
    database: 'Base de données',
    databaseTitle: 'Machines, outils et produits du foin',
    databaseIntro:
      'Trouvez un équipement selon son rôle, vérifiez ses connexions et suivez le foin vers l’étape suivante.',
    records: 'fiches',
    browse: 'Parcourir',
    relatedRecords: 'Équipements et produits de ce guide',
    tools: 'Outils d’usine',
    toolsTitle: 'Faites fonctionner votre chaîne de production',
    toolsIntro:
      'Repérez un arrêt, conservez vos vérifications et comparez la production avec vos propres mesures.',
    interactive: 'Interactif',
    notFound: 'Fiche introuvable',
    toolCards: [
      [
        'Diagnostiquer un problème',
        'Choisissez le symptôme et suivez les vérifications sans risque.',
        'DIAGNOSTIC',
      ],
      [
        'Enregistrer vos vérifications',
        'Vérifiez les connexions, l’alimentation et les passages par les scanners.',
        'LISTE',
      ],
      [
        'Comparer deux chaînes',
        'Repérez les goulets et estimez la rentabilité à partir de vos débits.',
        'CALCULATEUR',
      ],
    ],
  },
  de: {
    database: 'Datenbank',
    databaseTitle: 'Maschinen, Werkzeuge und Heuprodukte',
    databaseIntro:
      'Finde Geräte nach Aufgabe, prüfe ihre Anschlüsse und verfolge das Heu bis zum nächsten Schritt.',
    records: 'Einträge',
    browse: 'Ansehen',
    relatedRecords: 'Geräte und Produkte in diesem Guide',
    tools: 'Fabrikwerkzeuge',
    toolsTitle: 'Bring deine Produktionslinie zum Laufen',
    toolsIntro:
      'Finde die Ursache eines Stillstands, speichere deine Prüfungen und vergleiche deine eigenen Produktionsmessungen.',
    interactive: 'Interaktiv',
    notFound: 'Eintrag nicht gefunden',
    toolCards: [
      [
        'Fabrikproblem eingrenzen',
        'Wähle das Symptom und gehe die nächsten sicheren Prüfungen durch.',
        'DIAGNOSE',
      ],
      [
        'Aufbau-Checkliste speichern',
        'Prüfe Anschlüsse, Strom und Scannerwege beim Bauen.',
        'CHECKLISTE',
      ],
      [
        'Produktionslinien vergleichen',
        'Ermittle Engpässe und Amortisation mit selbst gemessenen Raten.',
        'RECHNER',
      ],
    ],
  },
  es: {
    database: 'Base de datos',
    databaseTitle: 'Máquinas, herramientas y productos del heno',
    databaseIntro:
      'Busca equipos por su función, revisa sus conexiones y sigue el heno hasta la siguiente etapa.',
    records: 'fichas',
    browse: 'Explorar',
    relatedRecords: 'Equipos y productos de esta guía',
    tools: 'Herramientas de fábrica',
    toolsTitle: 'Pon en marcha tu línea de producción',
    toolsIntro:
      'Localiza una parada, guarda tus comprobaciones y compara la producción con tus propias mediciones.',
    interactive: 'Interactivo',
    notFound: 'Ficha no encontrada',
    toolCards: [
      [
        'Diagnosticar un problema',
        'Elige el síntoma y sigue las próximas comprobaciones seguras.',
        'DIAGNÓSTICO',
      ],
      [
        'Guardar tu lista de montaje',
        'Comprueba conexiones, electricidad y rutas de escaneo al construir.',
        'LISTA',
      ],
      [
        'Comparar líneas de producción',
        'Calcula cuellos de botella y amortización con tus tasas observadas.',
        'CALCULADORA',
      ],
    ],
  },
  ru: {
    database: 'База данных',
    databaseTitle: 'Машины, инструменты и продукты из сена',
    databaseIntro:
      'Найдите оборудование по задаче, проверьте подключения и проследите путь сена к следующему этапу.',
    records: 'записей',
    browse: 'Открыть',
    relatedRecords: 'Оборудование и продукты в этом руководстве',
    tools: 'Инструменты фабрики',
    toolsTitle: 'Запустите производственную линию',
    toolsIntro:
      'Найдите причину остановки, сохраните проверки и сравните производство по собственным измерениям.',
    interactive: 'Интерактивно',
    notFound: 'Запись не найдена',
    toolCards: [
      [
        'Найти причину сбоя',
        'Выберите симптом и выполните следующие безопасные проверки.',
        'ДИАГНОСТИКА',
      ],
      [
        'Сохранить список проверок',
        'Проверяйте подключения, питание и маршруты через сканеры.',
        'СПИСОК',
      ],
      [
        'Сравнить производственные линии',
        'Найдите узкие места и оцените окупаемость по измеренной скорости.',
        'КАЛЬКУЛЯТОР',
      ],
    ],
  },
};

export function getDiscoveryCopy(locale: string): DiscoveryCopy {
  const copy = discoveryCopy[locale];
  if (!copy) throw new Error(`Missing discovery copy for ${locale}`);
  return copy;
}

export const FACTORY_TOOL_PATHS = [
  '/tools/line-check',
  '/tools/checklist',
  '/tools/production-calculator',
] as const;
