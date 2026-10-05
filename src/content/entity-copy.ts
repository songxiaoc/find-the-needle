export type EntityCopy = {
  kinds: Record<
    'machines' | 'tools' | 'products',
    { label: string; singularLabel: string; description: string }
  >;
  fields: Record<string, string>;
  use: string;
  checks: string;
  productTypes: string;
  search: string;
  searchPlaceholder: string;
  all: string;
  sort: string;
  ascending: string;
  descending: string;
  updated: string;
  resultCount: string;
  clear: string;
  view: string;
  fullImage: string;
  noMatches: string;
  empty: string;
  reset: string;
  version: string;
  scope: string;
  checked: string;
  related: string;
  guides: string;
  back: string;
  sources: string;
};

const copy: Record<string, EntityCopy> = {
  en: {
    kinds: {
      machines: {
        label: 'Machines & logistics',
        singularLabel: 'Machine',
        description:
          'Check conveyor connections, power, scanning paths and the equipment that keeps hay moving.',
      },
      tools: {
        label: 'Hand tools',
        singularLabel: 'Tool',
        description:
          'Manual hay handling and needle detection before you expand the factory.',
      },
      products: {
        label: 'Hay products',
        singularLabel: 'Product',
        description:
          'Understand hay wads, hidden needles and the product families described for the full game.',
      },
    },
    fields: {
      role: 'Role',
      scope: 'Available information',
      function: 'What it does',
      operation: 'How to use it',
      check: 'What to check',
      community: 'Community advice',
      limits: 'Before you spend',
      pulp: 'Hay pulp',
      bales: 'Compressed bales',
      bricks: 'Eco bricks',
      paper: 'Hay paper',
      pellets: 'Pellets',
    },
    use: 'Use and operation',
    checks: 'Checks and decisions',
    productTypes: 'Product families',
    search: 'Search',
    searchPlaceholder: 'Name, use or problem…',
    all: 'All',
    sort: 'Sort',
    ascending: 'Name A–Z',
    descending: 'Name Z–A',
    updated: 'Recently updated',
    resultCount: '{shown} of {total}',
    clear: 'Clear search and filters',
    view: 'View details',
    fullImage: 'View full-size image',
    noMatches: 'No matching entries',
    empty: 'Try a shorter search or remove a filter.',
    reset: 'Reset search',
    version: 'Information & sources',
    scope: 'Based on',
    checked: 'Checked',
    related: 'Connected equipment and products',
    guides: 'Continue with a guide',
    back: 'Back to',
    sources: 'Sources',
  },
  fr: {
    kinds: {
      machines: {
        label: 'Machines et logistique',
        singularLabel: 'Machine',
        description:
          'Vérifiez les convoyeurs, l’alimentation, les circuits de détection et le matériel qui fait avancer le foin.',
      },
      tools: {
        label: 'Outils manuels',
        singularLabel: 'Outil',
        description:
          'Manipulation du foin et détection des aiguilles avant d’agrandir votre usine.',
      },
      products: {
        label: 'Produits du foin',
        singularLabel: 'Produit',
        description:
          'Comprenez les paquets de foin, les aiguilles cachées et les produits annoncés pour le jeu complet.',
      },
    },
    fields: {
      role: 'Fonction',
      scope: 'Informations disponibles',
      function: 'À quoi cela sert',
      operation: 'Utilisation',
      check: 'Points à vérifier',
      community: 'Conseil communautaire',
      limits: 'Avant d’acheter',
      pulp: 'Pâte de foin',
      bales: 'Balles compressées',
      bricks: 'Briques écologiques',
      paper: 'Papier de foin',
      pellets: 'Granulés',
    },
    use: 'Fonctionnement et utilisation',
    checks: 'Vérifications et choix',
    productTypes: 'Familles de produits',
    search: 'Rechercher',
    searchPlaceholder: 'Nom, utilisation ou problème…',
    all: 'Tout',
    sort: 'Trier',
    ascending: 'Nom A–Z',
    descending: 'Nom Z–A',
    updated: 'Mises à jour récentes',
    resultCount: '{shown} sur {total}',
    clear: 'Effacer recherche et filtres',
    view: 'Voir les détails',
    fullImage: 'Voir l’image en grand',
    noMatches: 'Aucune entrée trouvée',
    empty: 'Essayez un terme plus court ou retirez un filtre.',
    reset: 'Réinitialiser la recherche',
    version: 'Informations et sources',
    scope: 'Basé sur',
    checked: 'Vérifié le',
    related: 'Matériel et produits associés',
    guides: 'Poursuivre avec un guide',
    back: 'Retour à',
    sources: 'Sources',
  },
  de: {
    kinds: {
      machines: {
        label: 'Maschinen und Transport',
        singularLabel: 'Maschine',
        description:
          'Prüfe Bandanschlüsse, Stromversorgung, Scanwege und Geräte für den Heutransport.',
      },
      tools: {
        label: 'Handwerkzeuge',
        singularLabel: 'Werkzeug',
        description:
          'Heu von Hand bewegen und Nadeln suchen, bevor du deine Fabrik ausbaust.',
      },
      products: {
        label: 'Heuprodukte',
        singularLabel: 'Produkt',
        description:
          'Heubündel, verborgene Nadeln und die angekündigten Produktgruppen des vollständigen Spiels.',
      },
    },
    fields: {
      role: 'Aufgabe',
      scope: 'Verfügbare Informationen',
      function: 'Funktion',
      operation: 'Verwendung',
      check: 'Prüfpunkte',
      community: 'Community-Tipp',
      limits: 'Vor dem Kauf',
      pulp: 'Heubrei',
      bales: 'Gepresste Ballen',
      bricks: 'Ökoziegel',
      paper: 'Heupapier',
      pellets: 'Pellets',
    },
    use: 'Funktion und Bedienung',
    checks: 'Prüfungen und Entscheidungen',
    productTypes: 'Produktgruppen',
    search: 'Suchen',
    searchPlaceholder: 'Name, Verwendung oder Problem…',
    all: 'Alle',
    sort: 'Sortieren',
    ascending: 'Name A–Z',
    descending: 'Name Z–A',
    updated: 'Zuletzt aktualisiert',
    resultCount: '{shown} von {total}',
    clear: 'Suche und Filter löschen',
    view: 'Details ansehen',
    fullImage: 'Bild in voller Größe ansehen',
    noMatches: 'Keine passenden Einträge',
    empty: 'Versuche einen kürzeren Suchbegriff oder entferne einen Filter.',
    reset: 'Suche zurücksetzen',
    version: 'Informationen und Quellen',
    scope: 'Grundlage',
    checked: 'Geprüft am',
    related: 'Verbundene Geräte und Produkte',
    guides: 'Weiterführende Anleitungen',
    back: 'Zurück zu',
    sources: 'Quellen',
  },
  es: {
    kinds: {
      machines: {
        label: 'Máquinas y logística',
        singularLabel: 'Máquina',
        description:
          'Comprueba conexiones de cintas, electricidad, rutas de escaneo y equipos para mover el heno.',
      },
      tools: {
        label: 'Herramientas manuales',
        singularLabel: 'Herramienta',
        description:
          'Manejo manual del heno y detección de agujas antes de ampliar la fábrica.',
      },
      products: {
        label: 'Productos del heno',
        singularLabel: 'Producto',
        description:
          'Comprende los paquetes de heno, las agujas ocultas y los productos anunciados para el juego completo.',
      },
    },
    fields: {
      role: 'Función',
      scope: 'Información disponible',
      function: 'Para qué sirve',
      operation: 'Cómo utilizarlo',
      check: 'Qué comprobar',
      community: 'Consejo de la comunidad',
      limits: 'Antes de comprar',
      pulp: 'Pulpa de heno',
      bales: 'Balas comprimidas',
      bricks: 'Ladrillos ecológicos',
      paper: 'Papel de heno',
      pellets: 'Pellets',
    },
    use: 'Función y uso',
    checks: 'Comprobaciones y decisiones',
    productTypes: 'Familias de productos',
    search: 'Buscar',
    searchPlaceholder: 'Nombre, uso o problema…',
    all: 'Todos',
    sort: 'Ordenar',
    ascending: 'Nombre A–Z',
    descending: 'Nombre Z–A',
    updated: 'Actualizados recientemente',
    resultCount: '{shown} de {total}',
    clear: 'Borrar búsqueda y filtros',
    view: 'Ver detalles',
    fullImage: 'Ver imagen a tamaño completo',
    noMatches: 'No hay resultados',
    empty: 'Prueba una búsqueda más corta o elimina un filtro.',
    reset: 'Restablecer búsqueda',
    version: 'Información y fuentes',
    scope: 'Basado en',
    checked: 'Comprobado',
    related: 'Equipos y productos relacionados',
    guides: 'Continuar con una guía',
    back: 'Volver a',
    sources: 'Fuentes',
  },
  ru: {
    kinds: {
      machines: {
        label: 'Машины и логистика',
        singularLabel: 'Машина',
        description:
          'Проверьте соединения конвейеров, питание, пути сканирования и оборудование для перемещения сена.',
      },
      tools: {
        label: 'Ручные инструменты',
        singularLabel: 'Инструмент',
        description:
          'Работа с сеном вручную и поиск иголок перед расширением фабрики.',
      },
      products: {
        label: 'Продукты из сена',
        singularLabel: 'Продукт',
        description:
          'Комки сена, скрытые иголки и виды продукции, заявленные для полной игры.',
      },
    },
    fields: {
      role: 'Назначение',
      scope: 'Доступные сведения',
      function: 'Для чего нужен',
      operation: 'Как использовать',
      check: 'Что проверить',
      community: 'Совет сообщества',
      limits: 'Перед покупкой',
      pulp: 'Сенная масса',
      bales: 'Прессованные тюки',
      bricks: 'Экокирпичи',
      paper: 'Бумага из сена',
      pellets: 'Пеллеты',
    },
    use: 'Назначение и использование',
    checks: 'Проверки и решения',
    productTypes: 'Виды продукции',
    search: 'Поиск',
    searchPlaceholder: 'Название, назначение или проблема…',
    all: 'Все',
    sort: 'Сортировка',
    ascending: 'Название А–Я',
    descending: 'Название Я–А',
    updated: 'Недавно обновлённые',
    resultCount: '{shown} из {total}',
    clear: 'Очистить поиск и фильтры',
    view: 'Подробнее',
    fullImage: 'Открыть изображение в полном размере',
    noMatches: 'Ничего не найдено',
    empty: 'Сократите запрос или уберите фильтр.',
    reset: 'Сбросить поиск',
    version: 'Сведения и источники',
    scope: 'Основание',
    checked: 'Проверено',
    related: 'Связанные машины и продукты',
    guides: 'Продолжить с руководством',
    back: 'Вернуться к',
    sources: 'Источники',
  },
};

export function getEntityCopy(locale = 'en'): EntityCopy {
  return copy[locale] ?? copy.en;
}
