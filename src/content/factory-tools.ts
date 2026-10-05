import { additionalFactoryCopy } from '@/generated/additional-locales';

export const FACTORY_TOOL_IDS = [
  'line-check',
  'checklist',
  'production-calculator',
] as const;
export type FactoryToolId = (typeof FACTORY_TOOL_IDS)[number];

export type FactoryCopy = {
  home: string;
  hub: string;
  intro: string;
  open: string;
  tools: Record<FactoryToolId, { title: string; description: string }>;
  diagnosis: {
    prompt: string;
    steps: string;
    links: string;
    sources: string;
    symptoms: { title: string; note: string; steps: string[] }[];
  };
  checklist: {
    note: string;
    progress: string;
    reset: string;
    loading: string;
    error: string;
    items: string[];
    guide: string;
  };
  calculator: {
    note: string;
    assumption: string;
    plan: string;
    optional: string;
    stage: string;
    rate: string;
    add: string;
    remove: string;
    stock: string;
    price: string;
    investment: string;
    operating: string;
    calculate: string;
    invalid: string;
    overflow: string;
    capacity: string;
    bottleneck: string;
    duration: string;
    revenue: string;
    profit: string;
    margin: string;
    payback: string;
    stopped: string;
    never: string;
    insufficient: string;
    empty: string;
    minutes: string;
    units: string;
    currency: string;
    formulas: string;
    formulaText: string;
    comparison: string;
    better: string;
    equal: string;
    resultHint: string;
  };
};

const en: FactoryCopy = {
  home: 'Home',
  hub: 'Factory tools',
  intro:
    'Check a stalled route, track your first working line, or compare production plans using your own measurements.',
  open: 'Open tool',
  tools: {
    'line-check': {
      title: 'Check your production line',
      description:
        'Choose what you see to check power, material flow and needle detection without dismantling your factory.',
    },
    checklist: {
      title: 'First production line checklist',
      description:
        'Follow one material route from collection to sale and save your checks on this device.',
    },
    'production-calculator': {
      title: 'Production and payback calculator',
      description:
        'Compare two lines using measured throughput, stock, sale price and costs.',
    },
  },
  diagnosis: {
    prompt: 'What is happening?',
    steps: 'Check in this order',
    links: 'Look closer',
    sources: 'Discussion and update sources',
    symptoms: [
      {
        title: 'A machine does not work',
        note: 'Start with what the machine displays. These are connection checks, not a guaranteed fix for a game bug.',
        steps: [
          'Read the input label and check that the material reaching it is accepted.',
          'Check the power connection, especially if several powered machines stopped together.',
          'Follow the output to a destination that accepts it. Watch one item complete the route before changing anything.',
        ],
      },
      {
        title: 'Hay or products back up',
        note: 'Players have suggested parallel scanning lanes. Try a second lane only after observing a queue at your scanner; it is not a verified universal layout.',
        steps: [
          'Find the first point where material stops, then inspect the next connection downstream.',
          'Check belt direction, arm pickup and delivery positions, and the destination input.',
          'If the scanner is the observed bottleneck, compare a parallel lane while keeping every sale route scanned. Change one connection at a time.',
        ],
      },
      {
        title: 'A needle was sold despite a scanner',
        note: 'The developer says needles sold inside products return to the haystack. Players also report arms taking side routes when lines are busy.',
        steps: [
          'Follow products from the Silo and other processors all the way to the Hay Sell Stand.',
          'Observe each robotic arm and any nearby belt that it can reach.',
          'Check every branch for a scanner, including branches that rejoin after your main scanner.',
        ],
      },
      {
        title: 'The Silo says a needle is waiting',
        note: 'A player suggested adding enough hay to form another wad. That suggestion is not a developer-confirmed fix.',
        steps: [
          'Back up your save before testing a change.',
          'Read the Silo status and follow its output. A needle can be packaged into a hay wad, according to the developer.',
          'If you test adding hay, change only that variable. Stop if the game warns about destroying a needle; dismantling the Silo is not a guaranteed recovery method.',
        ],
      },
      {
        title: '5/6 needles, with no hay left',
        note: 'The reports linked here did not contain a developer-confirmed general fix when checked on September 27, 2026.',
        steps: [
          'Keep and back up your save; do not erase progress to test a guess.',
          'Record your needle count, remaining hay, Silo status and route through the scanners.',
          'Review the linked report or share those details in a relevant Steam discussion. The usual return-to-pile mechanism does not prove that every missing-needle bug fixes itself.',
        ],
      },
    ],
  },
  checklist: {
    note: 'Checks are saved in this browser on this device. They do not read or change your game save.',
    progress: 'Completed',
    reset: 'Reset checks',
    loading: 'Loading saved checks…',
    error:
      'This browser could not save or read your checks. You can still use the list for this visit.',
    guide: 'Read the connection guide',
    items: [
      'Identify the material entering your route.',
      'Check the collection or storage output.',
      'Check each belt direction and robotic arm delivery point.',
      'Connect power where the machine requires it.',
      'Match each input label to the arriving material.',
      'Make sure every sale branch passes through a scanner.',
      'Check that the sale destination accepts the output.',
      'Watch one product complete the whole route, then check the needle counter.',
    ],
  },
  calculator: {
    note: 'Enter your own observed values. Rates use units per minute; all money values use the same in-game currency. No game prices or machine speeds are prefilled.',
    assumption:
      'Compare the same material in the same unit. If processing changes units, convert every rate and stock to equivalent final-product units first. This estimate assumes steady flow, enough power, no losses, and operating costs stopping when the stock runs out.',
    plan: 'Plan',
    optional: 'optional',
    stage: 'Stage',
    rate: 'Throughput (units/min)',
    add: 'Add stage',
    remove: 'Remove stage',
    stock: 'Available stock (units)',
    price: 'Sale price (currency/unit)',
    investment: 'Initial investment (currency)',
    operating: 'Running cost (currency/min)',
    calculate: 'Calculate / compare',
    invalid:
      'Fill every field with a finite number of 0 or more. Use a dot for decimals.',
    overflow:
      'These values are too large to calculate reliably. Use smaller values.',
    capacity: 'Line capacity',
    bottleneck: 'Slowest stage',
    duration: 'Time to process stock',
    revenue: 'Stock revenue',
    profit: 'Stock profit after running costs and investment',
    margin: 'Net income while running',
    payback: 'Time to recover investment',
    stopped: 'No flow: at least one stage has zero throughput.',
    never: 'No payback at this running margin.',
    insufficient: 'Available stock runs out before payback.',
    empty: 'No stock to process.',
    minutes: 'min',
    units: 'units/min',
    currency: 'currency',
    formulas: 'How it is calculated',
    formulaText:
      'Capacity = lowest stage rate. Time = stock ÷ capacity. Net income/min = capacity × price − running cost. Stock profit = stock × price − time × running cost − investment. Payback = investment ÷ net income/min, only while enough stock remains.',
    comparison: 'Results',
    better: 'Higher stock profit:',
    equal: 'Both plans have the same stock profit.',
    resultHint:
      'Results describe this stock batch, not unlimited production. Different stock quantities can change which plan earns more.',
  },
};

const fr: FactoryCopy = {
  home: 'Accueil',
  hub: 'Outils de production',
  intro:
    'Vérifiez une ligne bloquée, suivez votre première installation ou comparez des projets avec vos propres mesures.',
  open: 'Ouvrir',
  tools: {
    'line-check': {
      title: 'Vérifier votre ligne de production',
      description:
        'Choisissez le symptôme pour vérifier courant, matières et détection des aiguilles sans démonter votre usine.',
    },
    checklist: {
      title: 'Liste de contrôle de la première ligne',
      description:
        'Suivez une matière de la collecte à la vente et enregistrez vos vérifications sur cet appareil.',
    },
    'production-calculator': {
      title: 'Calculateur de production et de rentabilité',
      description:
        'Comparez deux lignes avec vos débits mesurés, stocks, prix de vente et coûts.',
    },
  },
  diagnosis: {
    prompt: 'Que se passe-t-il ?',
    steps: 'Vérifiez dans cet ordre',
    links: 'Pour approfondir',
    sources: 'Discussions et mises à jour',
    symptoms: [
      {
        title: 'Une machine ne fonctionne pas',
        note: 'Commencez par son affichage. Ces contrôles de raccordement ne garantissent pas de résoudre un bug.',
        steps: [
          'Lisez le libellé de l’entrée et vérifiez que la matière livrée est acceptée.',
          'Vérifiez le raccordement électrique, surtout si plusieurs machines se sont arrêtées ensemble.',
          'Suivez la sortie jusqu’à une destination adaptée. Observez un produit parcourir toute la ligne avant de modifier quoi que ce soit.',
        ],
      },
      {
        title: 'Le foin ou les produits s’accumulent',
        note: 'Des joueurs proposent des voies de détection parallèles. Essayez-en une deuxième seulement après avoir constaté une file devant le scanner ; ce n’est pas une configuration universelle vérifiée.',
        steps: [
          'Repérez le premier point d’arrêt, puis examinez le raccordement suivant en aval.',
          'Vérifiez le sens des convoyeurs, les points de prise et de dépôt des bras, et l’entrée de destination.',
          'Si le scanner limite visiblement le débit, comparez une voie parallèle en conservant la détection sur chaque trajet de vente. Modifiez un seul raccordement à la fois.',
        ],
      },
      {
        title: 'Une aiguille a été vendue malgré un scanner',
        note: 'Selon le développeur, les aiguilles vendues dans les produits retournent au tas de foin. Des joueurs signalent aussi des détours pris par les bras sur des lignes encombrées.',
        steps: [
          'Suivez les produits du Silo et des autres machines jusqu’au Hay Sell Stand.',
          'Observez chaque bras robotique et les convoyeurs proches qu’il peut atteindre.',
          'Vérifiez la présence d’un scanner sur chaque branche, y compris celles qui rejoignent la ligne après le scanner principal.',
        ],
      },
      {
        title: 'Le Silo indique une aiguille en attente',
        note: 'Un joueur suggère d’ajouter assez de foin pour former une nouvelle motte. Le développeur n’a pas confirmé cette solution.',
        steps: [
          'Sauvegardez une copie de votre partie avant de tester une modification.',
          'Lisez l’état du Silo et suivez sa sortie. Selon le développeur, une aiguille peut être emballée dans une motte de foin.',
          'Si vous ajoutez du foin, ne changez que cette variable. Arrêtez-vous si le jeu annonce la destruction d’une aiguille ; démonter le Silo ne garantit pas sa récupération.',
        ],
      },
      {
        title: '5/6 aiguilles et plus de foin',
        note: 'Lors de leur consultation le 27 septembre 2026, les signalements liés ne contenaient aucune solution générale confirmée par le développeur.',
        steps: [
          'Conservez votre sauvegarde et faites-en une copie ; n’effacez pas votre progression pour essayer une hypothèse.',
          'Notez le nombre d’aiguilles, le foin restant, l’état du Silo et le trajet à travers les scanners.',
          'Consultez le signalement ou transmettez ces informations dans une discussion Steam pertinente. Le retour normal au tas ne prouve pas que tous les bugs d’aiguille manquante se corrigent seuls.',
        ],
      },
    ],
  },
  checklist: {
    note: 'Les coches sont enregistrées dans ce navigateur sur cet appareil. Elles ne lisent ni ne modifient votre sauvegarde du jeu.',
    progress: 'Terminées',
    reset: 'Réinitialiser',
    loading: 'Chargement des coches…',
    error:
      'Ce navigateur ne peut pas lire ou enregistrer vos coches. La liste reste utilisable pendant cette visite.',
    guide: 'Lire le guide des raccordements',
    items: [
      'Identifier la matière qui entre dans la ligne.',
      'Vérifier la sortie de collecte ou de stockage.',
      'Vérifier le sens des convoyeurs et les points de dépôt des bras.',
      'Raccorder le courant quand la machine en a besoin.',
      'Faire correspondre chaque entrée à la matière qui arrive.',
      'Faire passer chaque branche de vente par un scanner.',
      'Vérifier que la destination de vente accepte le produit.',
      'Observer un produit parcourir toute la ligne, puis vérifier le compteur d’aiguilles.',
    ],
  },
  calculator: {
    note: 'Saisissez vos mesures. Les débits sont en unités par minute ; tous les montants utilisent la même monnaie du jeu. Aucun prix ni débit de machine n’est prérempli.',
    assumption:
      'Comparez la même matière dans la même unité. Si la transformation change les unités, convertissez d’abord tous les débits et stocks en unités équivalentes de produit fini. Le calcul suppose un flux stable, assez de courant, aucune perte et des frais qui cessent une fois le stock épuisé.',
    plan: 'Projet',
    optional: 'facultatif',
    stage: 'Étape',
    rate: 'Débit (unités/min)',
    add: 'Ajouter une étape',
    remove: 'Retirer cette étape',
    stock: 'Stock disponible (unités)',
    price: 'Prix de vente (monnaie/unité)',
    investment: 'Investissement initial (monnaie)',
    operating: 'Frais de fonctionnement (monnaie/min)',
    calculate: 'Calculer / comparer',
    invalid:
      'Remplissez chaque champ avec un nombre fini positif ou nul. Utilisez un point pour les décimales.',
    overflow:
      'Ces valeurs sont trop grandes pour un calcul fiable. Réduisez-les.',
    capacity: 'Capacité de la ligne',
    bottleneck: 'Étape la plus lente',
    duration: 'Durée de traitement du stock',
    revenue: 'Recette du stock',
    profit: 'Bénéfice du stock après frais et investissement',
    margin: 'Revenu net pendant le fonctionnement',
    payback: 'Durée de remboursement',
    stopped: 'Aucun flux : au moins une étape a un débit nul.',
    never: 'Pas de remboursement avec cette marge.',
    insufficient: 'Le stock s’épuise avant le remboursement.',
    empty: 'Aucun stock à traiter.',
    minutes: 'min',
    units: 'unités/min',
    currency: 'monnaie',
    formulas: 'Méthode de calcul',
    formulaText:
      'Capacité = débit minimal. Durée = stock ÷ capacité. Revenu net/min = capacité × prix − frais. Bénéfice du stock = stock × prix − durée × frais − investissement. Remboursement = investissement ÷ revenu net/min, uniquement tant que le stock suffit.',
    comparison: 'Résultats',
    better: 'Bénéfice du stock le plus élevé :',
    equal: 'Les deux projets ont le même bénéfice du stock.',
    resultHint:
      'Les résultats concernent ce stock, pas une production illimitée. Des stocks différents peuvent changer le projet le plus rentable.',
  },
};

const de: FactoryCopy = {
  home: 'Startseite',
  hub: 'Fabrikwerkzeuge',
  intro:
    'Prüfe eine blockierte Linie, verfolge deine erste Anlage oder vergleiche Pläne mit eigenen Messwerten.',
  open: 'Öffnen',
  tools: {
    'line-check': {
      title: 'Produktionslinie prüfen',
      description:
        'Wähle dein Problem und prüfe Strom, Materialfluss und Nadelerkennung, ohne deine Fabrik abzubauen.',
    },
    checklist: {
      title: 'Checkliste für die erste Produktionslinie',
      description:
        'Verfolge Material vom Sammeln bis zum Verkauf und speichere deine Prüfungen auf diesem Gerät.',
    },
    'production-calculator': {
      title: 'Produktions- und Amortisationsrechner',
      description:
        'Vergleiche zwei Linien mit gemessenem Durchsatz, Vorrat, Verkaufspreis und Kosten.',
    },
  },
  diagnosis: {
    prompt: 'Was passiert?',
    steps: 'In dieser Reihenfolge prüfen',
    links: 'Genauer nachlesen',
    sources: 'Diskussionen und Updates',
    symptoms: [
      {
        title: 'Eine Maschine arbeitet nicht',
        note: 'Beginne mit der Maschinenanzeige. Anschlussprüfungen garantieren keine Behebung eines Spielfehlers.',
        steps: [
          'Lies die Eingangsbezeichnung und prüfe, ob das ankommende Material akzeptiert wird.',
          'Prüfe den Stromanschluss, besonders wenn mehrere Maschinen gleichzeitig stehen bleiben.',
          'Verfolge den Ausgang bis zu einem passenden Ziel. Beobachte erst ein Produkt auf dem gesamten Weg, bevor du etwas änderst.',
        ],
      },
      {
        title: 'Heu oder Produkte stauen sich',
        note: 'Spieler schlagen parallele Scannerlinien vor. Teste eine zweite erst, wenn du tatsächlich eine Warteschlange am Scanner beobachtest; dies ist kein allgemein bestätigter Aufbau.',
        steps: [
          'Finde den ersten Stillstand und prüfe dann die nächste Verbindung dahinter.',
          'Prüfe Bandrichtung, Aufnahme- und Ablagepunkte der Roboterarme sowie den Zieleingang.',
          'Ist der Scanner der beobachtete Engpass, vergleiche eine parallele Linie. Jeder Verkaufsweg muss gescannt bleiben. Ändere jeweils nur eine Verbindung.',
        ],
      },
      {
        title: 'Trotz Scanner wurde eine Nadel verkauft',
        note: 'Laut Entwickler kehren in Produkten verkaufte Nadeln zum Heuhaufen zurück. Spieler berichten außerdem von Nebenwegen durch Arme bei überlasteten Linien.',
        steps: [
          'Verfolge Produkte vom Silo und anderen Maschinen bis zum Hay Sell Stand.',
          'Beobachte jeden Roboterarm und nahe Bänder, die er erreichen kann.',
          'Prüfe jeden Zweig auf einen Scanner, auch Zweige, die erst hinter dem Hauptscanner zusammenlaufen.',
        ],
      },
      {
        title: 'Das Silo meldet eine wartende Nadel',
        note: 'Ein Spieler empfiehlt genug Heu für einen weiteren Ballen. Diese Lösung ist nicht vom Entwickler bestätigt.',
        steps: [
          'Sichere deinen Spielstand vor einer Änderung.',
          'Lies den Silo-Status und verfolge den Ausgang. Laut Entwickler kann eine Nadel in einem Heubündel verpackt sein.',
          'Wenn du Heu hinzufügst, ändere nur diese eine Sache. Stoppe bei einer Warnung vor Nadelzerstörung; ein Silo-Abbau garantiert keine Rettung.',
        ],
      },
      {
        title: '5/6 Nadeln, aber kein Heu mehr',
        note: 'Die verlinkten Berichte enthielten bei der Prüfung am 27. September 2026 keine vom Entwickler bestätigte allgemeine Lösung.',
        steps: [
          'Behalte und sichere deinen Spielstand. Lösche keinen Fortschritt, um eine Vermutung zu testen.',
          'Notiere Nadelzahl, restliches Heu, Silo-Status und den Weg durch die Scanner.',
          'Lies den Bericht oder teile die Angaben in einer passenden Steam-Diskussion. Der normale Rückweg zum Haufen beweist nicht, dass sich jeder Fehler mit fehlenden Nadeln selbst löst.',
        ],
      },
    ],
  },
  checklist: {
    note: 'Häkchen werden in diesem Browser auf diesem Gerät gespeichert. Dein Spielstand wird weder gelesen noch verändert.',
    progress: 'Erledigt',
    reset: 'Zurücksetzen',
    loading: 'Gespeicherte Häkchen laden…',
    error:
      'Dieser Browser konnte Häkchen nicht lesen oder speichern. Die Liste bleibt für diesen Besuch nutzbar.',
    guide: 'Anschlussanleitung lesen',
    items: [
      'Material am Anfang der Linie identifizieren.',
      'Ausgang der Sammlung oder Lagerung prüfen.',
      'Jede Bandrichtung und den Ablagepunkt der Arme prüfen.',
      'Strom anschließen, wenn die Maschine ihn benötigt.',
      'Jede Eingangsbezeichnung mit dem ankommenden Material abgleichen.',
      'Jeden Verkaufszweig durch einen Scanner führen.',
      'Prüfen, ob die Verkaufsstelle das Produkt annimmt.',
      'Ein Produkt auf dem gesamten Weg beobachten und danach den Nadelzähler prüfen.',
    ],
  },
  calculator: {
    note: 'Gib deine beobachteten Werte ein. Durchsatz gilt in Einheiten pro Minute, Geldwerte in derselben Spielwährung. Preise und Maschinengeschwindigkeiten sind nicht vorausgefüllt.',
    assumption:
      'Vergleiche dasselbe Material in derselben Einheit. Bei Umwandlungen müssen alle Raten und Vorräte zuerst in gleichwertige Endprodukteinheiten umgerechnet werden. Die Schätzung setzt gleichmäßigen Fluss, genug Strom, keine Verluste und Betriebskosten voraus, die bei leerem Vorrat enden.',
    plan: 'Plan',
    optional: 'optional',
    stage: 'Stufe',
    rate: 'Durchsatz (Einheiten/min)',
    add: 'Stufe hinzufügen',
    remove: 'Stufe entfernen',
    stock: 'Verfügbarer Vorrat (Einheiten)',
    price: 'Verkaufspreis (Währung/Einheit)',
    investment: 'Anfangsinvestition (Währung)',
    operating: 'Betriebskosten (Währung/min)',
    calculate: 'Berechnen / vergleichen',
    invalid:
      'Fülle jedes Feld mit einer endlichen Zahl ab 0 aus. Nutze einen Punkt als Dezimaltrennzeichen.',
    overflow:
      'Die Werte sind für eine zuverlässige Berechnung zu groß. Verwende kleinere Werte.',
    capacity: 'Kapazität der Linie',
    bottleneck: 'Langsamste Stufe',
    duration: 'Zeit für den Vorrat',
    revenue: 'Erlös des Vorrats',
    profit: 'Gewinn nach Betriebskosten und Investition',
    margin: 'Nettoeinkommen im Betrieb',
    payback: 'Zeit bis zur Amortisation',
    stopped: 'Kein Fluss: Mindestens eine Stufe hat Durchsatz 0.',
    never: 'Keine Amortisation bei dieser Marge.',
    insufficient: 'Der Vorrat endet vor der Amortisation.',
    empty: 'Kein Vorrat zum Verarbeiten.',
    minutes: 'min',
    units: 'Einheiten/min',
    currency: 'Währung',
    formulas: 'Berechnung',
    formulaText:
      'Kapazität = niedrigster Durchsatz. Zeit = Vorrat ÷ Kapazität. Nettoeinkommen/min = Kapazität × Preis − Betriebskosten. Gewinn = Vorrat × Preis − Zeit × Betriebskosten − Investition. Amortisation = Investition ÷ Nettoeinkommen/min, solange der Vorrat reicht.',
    comparison: 'Ergebnisse',
    better: 'Höherer Gewinn aus dem Vorrat:',
    equal: 'Beide Pläne erzielen denselben Gewinn.',
    resultHint:
      'Die Ergebnisse gelten für diesen Vorrat, nicht für unbegrenzte Produktion. Andere Vorratsmengen können den rentableren Plan ändern.',
  },
};

const es: FactoryCopy = {
  home: 'Inicio',
  hub: 'Herramientas de fábrica',
  intro:
    'Revisa una línea atascada, sigue tu primera instalación o compara planes con tus propias mediciones.',
  open: 'Abrir',
  tools: {
    'line-check': {
      title: 'Revisa tu línea de producción',
      description:
        'Elige el síntoma para revisar electricidad, materiales y detección de agujas sin desmontar tu fábrica.',
    },
    checklist: {
      title: 'Lista para tu primera línea de producción',
      description:
        'Sigue el material desde la recogida hasta la venta y guarda las comprobaciones en este dispositivo.',
    },
    'production-calculator': {
      title: 'Calculadora de producción y amortización',
      description:
        'Compara dos líneas con caudal medido, existencias, precio de venta y costes.',
    },
  },
  diagnosis: {
    prompt: '¿Qué está pasando?',
    steps: 'Comprueba en este orden',
    links: 'Consulta más detalles',
    sources: 'Discusiones y actualizaciones',
    symptoms: [
      {
        title: 'Una máquina no funciona',
        note: 'Empieza por lo que muestra la máquina. Revisar conexiones no garantiza corregir un fallo del juego.',
        steps: [
          'Lee la etiqueta de entrada y confirma que acepta el material que llega.',
          'Revisa la conexión eléctrica, sobre todo si varias máquinas se paran a la vez.',
          'Sigue la salida hasta un destino que la acepte. Observa un producto recorrer toda la ruta antes de cambiar algo.',
        ],
      },
      {
        title: 'Se acumulan heno o productos',
        note: 'Algunos jugadores proponen vías de escaneo paralelas. Prueba una segunda solo si observas una cola ante el escáner; no es un diseño universal verificado.',
        steps: [
          'Busca el primer punto donde se detiene el material y revisa la siguiente conexión aguas abajo.',
          'Revisa la dirección de las cintas, los puntos de recogida y entrega de los brazos y la entrada de destino.',
          'Si el escáner es el cuello de botella observado, compara una vía paralela manteniendo el escaneo de todas las rutas de venta. Cambia una conexión cada vez.',
        ],
      },
      {
        title: 'Se vendió una aguja a pesar del escáner',
        note: 'El desarrollador explica que las agujas vendidas dentro de productos vuelven al montón de heno. Los jugadores también describen desvíos de los brazos cuando las líneas se congestionan.',
        steps: [
          'Sigue los productos del Silo y de las demás máquinas hasta el Hay Sell Stand.',
          'Observa cada brazo robótico y las cintas cercanas que puede alcanzar.',
          'Revisa que cada ramal tenga un escáner, incluidos los que se unen después del escáner principal.',
        ],
      },
      {
        title: 'El Silo indica una aguja en espera',
        note: 'Un jugador sugirió añadir suficiente heno para formar otro fardo. No es una solución confirmada por el desarrollador.',
        steps: [
          'Haz una copia de tu partida antes de probar un cambio.',
          'Lee el estado del Silo y sigue su salida. Según el desarrollador, una aguja puede quedar dentro de un fardo de heno.',
          'Si añades heno, cambia solo esa variable. Detente si el juego avisa de que destruirá una aguja; desmontar el Silo no garantiza recuperarla.',
        ],
      },
      {
        title: '5/6 agujas y no queda heno',
        note: 'Al revisar los informes enlazados el 27 de septiembre de 2026, no había una solución general confirmada por el desarrollador.',
        steps: [
          'Conserva tu partida y haz una copia. No borres el progreso para probar una suposición.',
          'Anota el contador de agujas, el heno restante, el estado del Silo y el recorrido por los escáneres.',
          'Revisa el informe o comparte los detalles en una discusión Steam pertinente. El retorno habitual al montón no demuestra que todos los fallos de agujas perdidas se resuelvan solos.',
        ],
      },
    ],
  },
  checklist: {
    note: 'Las marcas se guardan en este navegador y dispositivo. No leen ni cambian tu partida del juego.',
    progress: 'Completadas',
    reset: 'Reiniciar',
    loading: 'Cargando marcas guardadas…',
    error:
      'Este navegador no pudo leer o guardar las marcas. Puedes seguir usando la lista durante esta visita.',
    guide: 'Leer la guía de conexiones',
    items: [
      'Identificar el material que entra en la ruta.',
      'Revisar la salida de recogida o almacenamiento.',
      'Revisar la dirección de cada cinta y la entrega de cada brazo.',
      'Conectar la electricidad cuando la máquina la necesite.',
      'Comparar cada etiqueta de entrada con el material que llega.',
      'Hacer pasar cada ramal de venta por un escáner.',
      'Comprobar que el destino de venta acepta el producto.',
      'Observar un producto recorrer toda la ruta y después revisar el contador de agujas.',
    ],
  },
  calculator: {
    note: 'Introduce tus valores observados. El caudal se expresa en unidades por minuto; todos los importes usan la misma moneda del juego. No hay precios ni velocidades preestablecidos.',
    assumption:
      'Compara el mismo material en la misma unidad. Si el procesado cambia las unidades, convierte primero caudales y existencias a unidades equivalentes del producto final. La estimación supone flujo estable, electricidad suficiente, ninguna pérdida y costes que cesan al agotarse las existencias.',
    plan: 'Plan',
    optional: 'opcional',
    stage: 'Etapa',
    rate: 'Caudal (unidades/min)',
    add: 'Añadir etapa',
    remove: 'Quitar etapa',
    stock: 'Existencias disponibles (unidades)',
    price: 'Precio de venta (moneda/unidad)',
    investment: 'Inversión inicial (moneda)',
    operating: 'Coste operativo (moneda/min)',
    calculate: 'Calcular / comparar',
    invalid:
      'Completa cada campo con un número finito igual o mayor que 0. Usa un punto para los decimales.',
    overflow:
      'Los valores son demasiado grandes para un cálculo fiable. Usa valores menores.',
    capacity: 'Capacidad de la línea',
    bottleneck: 'Etapa más lenta',
    duration: 'Tiempo para procesar existencias',
    revenue: 'Ingresos de las existencias',
    profit: 'Beneficio tras costes operativos e inversión',
    margin: 'Ingreso neto en funcionamiento',
    payback: 'Tiempo para recuperar la inversión',
    stopped: 'Sin flujo: al menos una etapa tiene caudal cero.',
    never: 'No se recupera la inversión con este margen.',
    insufficient: 'Las existencias se agotan antes de recuperar la inversión.',
    empty: 'No hay existencias que procesar.',
    minutes: 'min',
    units: 'unidades/min',
    currency: 'moneda',
    formulas: 'Cómo se calcula',
    formulaText:
      'Capacidad = caudal mínimo. Tiempo = existencias ÷ capacidad. Ingreso neto/min = capacidad × precio − coste operativo. Beneficio = existencias × precio − tiempo × coste operativo − inversión. Amortización = inversión ÷ ingreso neto/min, mientras queden existencias suficientes.',
    comparison: 'Resultados',
    better: 'Mayor beneficio de las existencias:',
    equal: 'Ambos planes tienen el mismo beneficio.',
    resultHint:
      'Los resultados corresponden a estas existencias, no a producción ilimitada. Otras cantidades pueden cambiar qué plan gana más.',
  },
};

const ru: FactoryCopy = {
  home: 'Главная',
  hub: 'Инструменты фабрики',
  intro:
    'Проверьте остановившуюся линию, настройте первую установку или сравните планы по собственным измерениям.',
  open: 'Открыть',
  tools: {
    'line-check': {
      title: 'Проверка производственной линии',
      description:
        'Выберите симптом и проверьте электричество, движение материалов и поиск игл, не разбирая фабрику.',
    },
    checklist: {
      title: 'Чек-лист первой производственной линии',
      description:
        'Проследите материал от сбора до продажи и сохраните отметки на этом устройстве.',
    },
    'production-calculator': {
      title: 'Калькулятор производства и окупаемости',
      description:
        'Сравните две линии по измеренной скорости, запасу, цене продажи и затратам.',
    },
  },
  diagnosis: {
    prompt: 'Что происходит?',
    steps: 'Проверьте по порядку',
    links: 'Подробнее',
    sources: 'Обсуждения и обновления',
    symptoms: [
      {
        title: 'Машина не работает',
        note: 'Начните с показаний машины. Проверка соединений не гарантирует исправления ошибки игры.',
        steps: [
          'Прочитайте подпись входа и убедитесь, что он принимает поступающий материал.',
          'Проверьте подключение электричества, особенно если несколько машин остановились одновременно.',
          'Проследите выход до места, которое принимает продукт. Наблюдайте один полный проход продукта, прежде чем что-либо менять.',
        ],
      },
      {
        title: 'Сено или продукты скапливаются',
        note: 'Игроки предлагают параллельные линии сканирования. Испытывайте вторую только при наблюдаемой очереди у сканера; это не универсальная проверенная схема.',
        steps: [
          'Найдите первое место остановки материала, затем проверьте следующее соединение по ходу линии.',
          'Проверьте направление лент, места захвата и передачи роботизированных рук и вход назначения.',
          'Если узкое место действительно сканер, сравните параллельную линию, сохраняя сканирование каждого пути продажи. Меняйте одно соединение за раз.',
        ],
      },
      {
        title: 'Игла продана, хотя есть сканер',
        note: 'По словам разработчика, иглы, проданные внутри продуктов, возвращаются в стог. Игроки также сообщают об обходных путях рук при загруженных линиях.',
        steps: [
          'Проследите продукты от Silo и других машин до Hay Sell Stand.',
          'Понаблюдайте за каждой роботизированной рукой и соседними лентами, до которых она дотягивается.',
          'Проверьте наличие сканера на каждой ветке, в том числе на ветках, соединяющихся после основного сканера.',
        ],
      },
      {
        title: 'Silo сообщает об ожидающей игле',
        note: 'Один игрок предложил добавить сена для следующего пучка. Разработчик не подтвердил это решение.',
        steps: [
          'Сделайте резервную копию сохранения перед экспериментом.',
          'Прочитайте статус Silo и проследите выход. По словам разработчика, игла может находиться внутри пучка сена.',
          'Если добавляете сено, меняйте только этот фактор. Остановитесь при предупреждении об уничтожении иглы; разборка Silo не гарантирует её возврата.',
        ],
      },
      {
        title: '5/6 игл, а сена уже нет',
        note: 'На момент проверки 27 сентября 2026 года в связанных сообщениях не было общего решения, подтверждённого разработчиком.',
        steps: [
          'Сохраните прогресс и сделайте резервную копию. Не удаляйте сохранение ради проверки догадки.',
          'Запишите число игл, остаток сена, статус Silo и путь через сканеры.',
          'Прочитайте сообщение или поделитесь данными в подходящем обсуждении Steam. Обычный возврат игл в стог не доказывает, что любой сбой с пропавшей иглой решится сам.',
        ],
      },
    ],
  },
  checklist: {
    note: 'Отметки хранятся в этом браузере на этом устройстве. Они не читают и не изменяют сохранение игры.',
    progress: 'Выполнено',
    reset: 'Сбросить отметки',
    loading: 'Загрузка отметок…',
    error:
      'Браузер не смог прочитать или сохранить отметки. Список можно использовать до конца этого посещения.',
    guide: 'Прочитать руководство по соединениям',
    items: [
      'Определить материал на входе линии.',
      'Проверить выход сбора или хранения.',
      'Проверить направление каждой ленты и точки передачи рук.',
      'Подключить электричество, если машина его требует.',
      'Сопоставить подписи входов с поступающим материалом.',
      'Пропустить каждую ветку продажи через сканер.',
      'Проверить, принимает ли точка продажи продукт.',
      'Проследить полный проход продукта, затем проверить счётчик игл.',
    ],
  },
  calculator: {
    note: 'Введите собственные наблюдения. Скорость задаётся в единицах в минуту; все суммы — в одной игровой валюте. Цены и скорости машин не заполнены заранее.',
    assumption:
      'Сравнивайте один материал в одной единице измерения. Если обработка меняет единицы, сначала пересчитайте скорости и запас в эквивалентные единицы готового продукта. Расчёт предполагает стабильный поток, достаточное питание, отсутствие потерь и прекращение текущих затрат после исчерпания запаса.',
    plan: 'План',
    optional: 'необязательно',
    stage: 'Этап',
    rate: 'Скорость (единиц/мин)',
    add: 'Добавить этап',
    remove: 'Удалить этап',
    stock: 'Доступный запас (единиц)',
    price: 'Цена продажи (валюта/единица)',
    investment: 'Начальные вложения (валюта)',
    operating: 'Текущие затраты (валюта/мин)',
    calculate: 'Рассчитать / сравнить',
    invalid:
      'Заполните все поля конечными числами не меньше 0. Используйте точку для дробной части.',
    overflow:
      'Значения слишком велики для надёжного расчёта. Используйте меньшие числа.',
    capacity: 'Производительность линии',
    bottleneck: 'Самый медленный этап',
    duration: 'Время обработки запаса',
    revenue: 'Выручка от запаса',
    profit: 'Прибыль после текущих затрат и вложений',
    margin: 'Чистый доход во время работы',
    payback: 'Время окупаемости',
    stopped: 'Потока нет: скорость хотя бы одного этапа равна нулю.',
    never: 'При этой марже окупаемости нет.',
    insufficient: 'Запас закончится до окупаемости.',
    empty: 'Нет запаса для обработки.',
    minutes: 'мин',
    units: 'единиц/мин',
    currency: 'валюта',
    formulas: 'Как считается',
    formulaText:
      'Производительность = минимальная скорость этапа. Время = запас ÷ производительность. Чистый доход/мин = производительность × цена − текущие затраты. Прибыль = запас × цена − время × затраты − вложения. Окупаемость = вложения ÷ чистый доход/мин, пока запаса хватает.',
    comparison: 'Результаты',
    better: 'Больше прибыли от запаса:',
    equal: 'Прибыль обоих планов одинакова.',
    resultHint:
      'Результаты относятся к этому запасу, а не к неограниченному производству. Другой объём запаса может изменить более выгодный план.',
  },
};

const copy: Record<string, FactoryCopy> = {
  en,
  fr,
  de,
  es,
  ru,
  ...additionalFactoryCopy,
};
export function getFactoryCopy(locale: string): FactoryCopy {
  return copy[locale] ?? en;
}

export const DIAGNOSIS_LINKS = [
  [
    '/database/machines/power-pole',
    '/database/machines/conveyor-belt',
    '/guides/guide/automation',
  ],
  [
    '/database/machines/needle-scanner',
    '/database/machines/robotic-arm',
    '/guides/guide/automation',
  ],
  [
    '/database/machines/silo',
    '/database/machines/needle-scanner',
    '/database/machines/hay-sell-stand',
    '/guides/guide/needles-and-scanners',
  ],
  [
    '/database/machines/silo',
    '/database/products/hay-wad',
    '/guides/guide/demo',
    '/guides/guide/needles-and-scanners',
  ],
  ['/guides/guide/demo', '/guides/guide/needles-and-scanners'],
] as const;
export const DIAGNOSIS_SOURCES = [
  [
    'https://steamcommunity.com/games/5160800/announcements/detail/688642424435639126',
  ],
  ['https://steamcommunity.com/app/5160800/discussions/0/567046289381054539/'],
  [
    'https://steamcommunity.com/app/5160800/discussions/0/563667940587640064/',
    'https://steamcommunity.com/app/5160800/discussions/0/567046289381054539/',
  ],
  ['https://steamcommunity.com/app/5160800/discussions/0/563667940587640064/'],
  ['https://steamcommunity.com/app/5160800/discussions/0/587312703065119554/'],
] as const;
