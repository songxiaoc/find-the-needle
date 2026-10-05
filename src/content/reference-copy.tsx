import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { SectionTitle } from '@/components/site/ui';
import { additionalReferenceCopy } from '@/generated/additional-locales';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';

type AdditionalLocale = keyof typeof additionalReferenceCopy;
type AdditionalPack = (typeof additionalReferenceCopy)[AdditionalLocale];
type Locale = 'en' | 'fr' | 'de' | 'es' | 'ru' | AdditionalLocale;

function referencePart<Key extends keyof AdditionalPack>(key: Key) {
  return Object.fromEntries(
    Object.entries(additionalReferenceCopy).map(([locale, copy]) => [
      locale,
      copy[key],
    ])
  ) as Record<AdditionalLocale, AdditionalPack[Key]>;
}
export type ReferenceKey =
  | 'faq'
  | 'system-requirements'
  | 'troubleshooting'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service';
type Section = { title: string; text: string; link?: keyof typeof LINKS };
type Copy = {
  title: string;
  description: string;
  intro: string;
  sections: Section[];
};
const practicalGuides: Record<Locale, readonly string[]> = {
  ...referencePart('practicalGuides'),
  en: [
    'Help with your current save',
    'Back up your Demo save',
    'Check a stalled conveyor or power grid',
    'Track a missing needle through the Silo and scanners',
  ],
  fr: [
    'Aide pour votre partie',
    'Sauvegarder une copie de votre partie',
    'Vérifier un convoyeur ou un réseau électrique arrêté',
    'Chercher une aiguille dans le silo et les scanners',
  ],
  de: [
    'Hilfe für deinen Spielstand',
    'Demo-Spielstand sichern',
    'Stillstehende Förderbänder und Stromnetze prüfen',
    'Eine fehlende Nadel durch Silo und Scanner verfolgen',
  ],
  es: [
    'Ayuda para tu partida',
    'Crear una copia de tu partida de la demo',
    'Revisar una cinta o una red eléctrica detenida',
    'Seguir una aguja perdida por el silo y los escáneres',
  ],
  ru: [
    'Помощь с текущей игрой',
    'Сохранить резервную копию прогресса',
    'Проверить остановившийся конвейер или электросеть',
    'Проследить путь пропавшей иголки через силос и сканеры',
  ],
} as const;
const practicalGuidePaths = [
  '/guides/guide/demo',
  '/guides/guide/automation',
  '/guides/guide/needles-and-scanners',
] as const;
const LINKS = {
  store: 'https://store.steampowered.com/app/5160800/Find_the_Needle/',
  demo: 'https://store.steampowered.com/app/5165210/Find_the_Needle_Demo/',
  community: 'https://steamcommunity.com/app/5160800/discussions/',
  feedback: 'https://github.com/songxiaoc/find-the-needle/issues',
  verify: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
  cloudflare: 'https://www.cloudflare.com/privacypolicy/',
  adsterra: 'https://adsterra.com/privacy-policy-managed/',
} as const;

const labels: Record<
  Locale,
  {
    home: string;
    updated: string;
    links: Record<keyof typeof LINKS, string>;
    specs: string[];
    minimum: string;
    recommended: string;
    storage: string;
    gpu: string;
    platform: string;
  }
> = {
  ...referencePart('labels'),
  en: {
    home: 'Home',
    updated: 'Updated 27 September 2026',
    links: {
      store: 'Find the Needle on Steam',
      demo: 'Free demo on Steam',
      community: 'Steam community discussions',
      feedback: 'Report a site issue on GitHub',
      verify: 'Steam: verify game files',
      cloudflare: 'Cloudflare privacy policy',
      adsterra: 'Adsterra privacy policy',
    },
    specs: ['Operating system', 'Processor', 'Memory', 'Graphics', 'Storage'],
    minimum: 'Minimum',
    recommended: 'Recommended',
    storage: '2 GB available',
    gpu: '4 GB VRAM; Vulkan 1.3',
    platform: 'Windows requirements',
  },
  fr: {
    home: 'Accueil',
    updated: 'Mis à jour le 27 septembre 2026',
    links: {
      store: 'Find the Needle sur Steam',
      demo: 'Démo gratuite sur Steam',
      community: 'Discussions de la communauté Steam',
      feedback: 'Signaler un problème du site sur GitHub',
      verify: 'Steam : vérifier les fichiers du jeu',
      cloudflare: 'Politique de confidentialité de Cloudflare',
      adsterra: 'Politique de confidentialité d’Adsterra',
    },
    specs: [
      'Système',
      'Processeur',
      'Mémoire vive',
      'Carte graphique',
      'Stockage',
    ],
    minimum: 'Minimum',
    recommended: 'Recommandé',
    storage: '2 Go disponibles',
    gpu: '4 Go de VRAM ; Vulkan 1.3',
    platform: 'Configuration Windows',
  },
  de: {
    home: 'Startseite',
    updated: 'Aktualisiert am 27. September 2026',
    links: {
      store: 'Find the Needle auf Steam',
      demo: 'Kostenlose Demo auf Steam',
      community: 'Diskussionen in der Steam-Community',
      feedback: 'Website-Fehler auf GitHub melden',
      verify: 'Steam: Spieldateien überprüfen',
      cloudflare: 'Datenschutzerklärung von Cloudflare',
      adsterra: 'Datenschutzerklärung von Adsterra',
    },
    specs: [
      'Betriebssystem',
      'Prozessor',
      'Arbeitsspeicher',
      'Grafikkarte',
      'Speicherplatz',
    ],
    minimum: 'Minimum',
    recommended: 'Empfohlen',
    storage: '2 GB verfügbar',
    gpu: '4 GB VRAM; Vulkan 1.3',
    platform: 'Windows-Systemanforderungen',
  },
  es: {
    home: 'Inicio',
    updated: 'Actualizado el 27 de septiembre de 2026',
    links: {
      store: 'Find the Needle en Steam',
      demo: 'Demo gratuita en Steam',
      community: 'Discusiones de la comunidad de Steam',
      feedback: 'Comunicar un error del sitio en GitHub',
      verify: 'Steam: verificar los archivos del juego',
      cloudflare: 'Política de privacidad de Cloudflare',
      adsterra: 'Política de privacidad de Adsterra',
    },
    specs: [
      'Sistema operativo',
      'Procesador',
      'Memoria',
      'Tarjeta gráfica',
      'Almacenamiento',
    ],
    minimum: 'Mínimo',
    recommended: 'Recomendado',
    storage: '2 GB disponibles',
    gpu: '4 GB de VRAM; Vulkan 1.3',
    platform: 'Requisitos para Windows',
  },
  ru: {
    home: 'Главная',
    updated: 'Обновлено 27 сентября 2026 г.',
    links: {
      store: 'Find the Needle в Steam',
      demo: 'Бесплатная демоверсия в Steam',
      community: 'Обсуждения в сообществе Steam',
      feedback: 'Сообщить об ошибке сайта на GitHub',
      verify: 'Steam: проверка файлов игры',
      cloudflare: 'Политика конфиденциальности Cloudflare',
      adsterra: 'Политика конфиденциальности Adsterra',
    },
    specs: [
      'Операционная система',
      'Процессор',
      'Оперативная память',
      'Видеокарта',
      'Место на диске',
    ],
    minimum: 'Минимальные',
    recommended: 'Рекомендуемые',
    storage: '2 ГБ свободного места',
    gpu: '4 ГБ видеопамяти; Vulkan 1.3',
    platform: 'Требования для Windows',
  },
};

const content: Record<Locale, Record<ReferenceKey, Copy>> = {
  ...(referencePart('content') as Record<
    AdditionalLocale,
    Record<ReferenceKey, Copy>
  >),
  en: {
    faq: {
      title: 'Find the Needle FAQ',
      description:
        'Find the Needle release window, free demo, supported platforms and single-player details, with links to the official Steam listings.',
      intro:
        'The free demo is available now. The full game is listed for Q4 2026 on Steam, with no exact release day announced in the listing checked on 27 September 2026.',
      sections: [
        {
          title: 'Where can I play the demo?',
          text: 'Find the Needle Demo launched on 10 September 2026. Install it through its own Steam listing; adding the full game to your wishlist does not install the demo.',
          link: 'demo',
        },
        {
          title: 'What do you do in the game?',
          text: 'Search a haystack for needles, sell hay and reinvest in tools and machinery. Manual digging develops into a factory with conveyors, balers, scanners and robotic arms.',
          link: 'store',
        },
        {
          title: 'Is it multiplayer?',
          text: 'The Steam listing identifies Find the Needle as a single-player game. It does not advertise cooperative or competitive multiplayer.',
        },
        {
          title: 'Can I play on Mac, Linux or consoles?',
          text: 'The announced Steam version supports Windows. The listing does not offer native macOS or Linux versions, and it does not confirm a console release. Compatibility-layer or handheld performance is not established here.',
        },
        {
          title: 'Which languages does it support?',
          text: 'Steam lists English, French, German, Spanish (Spain) and Russian among the game’s supported languages. Check the store language table before downloading; use this site’s language selector to see the available guide translations.',
          link: 'store',
        },
        {
          title: 'Does demo progress carry over?',
          text: 'The store information checked for this guide does not confirm save transfer to the full game. Keep your demo saves and wait for an explicit announcement before assuming progress will carry over.',
        },
      ],
    },
    'system-requirements': {
      title: 'Find the Needle system requirements',
      description:
        'Official Windows minimum and recommended specifications for Find the Needle, including Vulkan graphics support and the integrated-GPU warning.',
      intro:
        'The Steam listing requires Windows and a dedicated graphics card. Integrated graphics are explicitly unsupported and may cause crashes. These specifications were checked on 27 September 2026.',
      sections: [
        {
          title: 'Before installing on a laptop',
          text: 'Compare the exact GPU model and video memory, not just the laptop’s RAM. The minimum GPU must support Vulkan 1.3. If your laptop has both integrated and dedicated graphics, make sure the game uses the dedicated GPU.',
        },
        {
          title: 'Large factories and handhelds',
          text: 'The developer notes that very large factories are CPU-heavy. Meeting the minimum requirements does not establish a particular frame rate. We have no verified Steam Deck performance results or native macOS/Linux requirements to report.',
          link: 'store',
        },
      ],
    },
    troubleshooting: {
      title: 'Find the Needle troubleshooting',
      description:
        'Safe first checks for Find the Needle demo crashes and launch problems: supported graphics, Steam file verification and useful bug-report details.',
      intro:
        'If the demo will not start, check your graphics hardware first: the official requirements exclude integrated graphics and require Vulkan 1.3 support. The steps below are general Steam checks, not confirmed fixes for a specific game bug.',
      sections: [
        {
          title: '1. Check hardware and updates',
          text: 'Compare your PC with the system requirements. Finish pending Steam downloads, restart the computer, and install the current graphics driver from your GPU manufacturer. On a laptop with two GPUs, select the dedicated GPU for the game in Windows graphics settings.',
        },
        {
          title: '2. Verify the installation',
          text: 'In your Steam library, right-click Find the Needle Demo and open Properties → Installed Files → Verify integrity of game files. Let verification finish before launching again. Test after each change so you can tell which step helped.',
          link: 'verify',
        },
        {
          title: '3. If a growing factory slows down',
          text: 'Close other demanding applications and check whether the slowdown appears only in the large factory. The developer says large factories put extra load on the CPU; lowering resolution alone may not address that limit.',
        },
        {
          title: '4. Report a repeatable problem',
          text: 'Include whether you are playing the demo, your Windows version, CPU, GPU, driver version, the exact error text and steps that reproduce the issue. Attach a screenshot if useful, after removing personal information. Keep existing saves; do not delete save folders as a first troubleshooting step.',
          link: 'community',
        },
      ],
    },
    about: {
      title: 'About this Find the Needle guide',
      description:
        'Learn about the independent Find the Needle fan guide, its sources, corrections and relationship to the game’s creators.',
      intro:
        'findtheneedle.site is an independent, unofficial guide to Find the Needle. It helps players understand the demo, plan their first factory and check practical information before playing.',
      sections: [
        {
          title: 'Independent from the game’s creators',
          text: 'This site is not operated, endorsed or sponsored by FindTheNeedleDev, Hay Passionates or Valve. Find the Needle is developed by FindTheNeedleDev and published by Hay Passionates. Game names, artwork and screenshots belong to their respective owners.',
        },
        {
          title: 'How we use sources',
          text: 'Release and hardware information comes from the official Steam listings. Guides distinguish announced features from practical suggestions. The demo and full game can change, so a dated statement should be read in the context of its update date.',
          link: 'store',
        },
        {
          title: 'Corrections and contributions',
          text: 'If a guide is incorrect or a translation is unclear, send the page URL, the correction and a supporting screenshot or official link. Please identify the demo or game version you used.',
          link: 'feedback',
        },
      ],
    },
    contact: {
      title: 'Contact and corrections',
      description:
        'Report an error in the Find the Needle guide or find the official Steam community for game-related questions.',
      intro:
        'For a site correction, broken link or translation problem, open an issue in the website’s GitHub repository. Game bugs and purchase questions belong with the game’s official channels or Steam Support.',
      sections: [
        {
          title: 'Report a website issue',
          text: 'Include the page URL, language, what is wrong and the suggested correction. A source link or screenshot helps us check the issue. GitHub requires an account to post; issues are public, so do not include passwords, payment details or other sensitive information.',
          link: 'feedback',
        },
        {
          title: 'Get help with the game',
          text: 'The Steam community is the place to look for developer announcements and game discussions. This fan site cannot access your game saves, Steam account or purchases, and cannot issue refunds.',
          link: 'community',
        },
        {
          title: 'Rights and privacy questions',
          text: 'Use the website issue tracker for an initial rights or privacy enquiry, identifying the affected page or material. Do not publish identity documents or confidential evidence in a public issue.',
          link: 'feedback',
        },
      ],
    },
    'privacy-policy': {
      title: 'Privacy policy',
      description:
        'How findtheneedle.site handles hosting requests, browser preferences, audience statistics and third-party links.',
      intro:
        'This policy covers findtheneedle.site, an independent Find the Needle guide. Reading the site does not require an account, a payment or a form submission.',
      sections: [
        {
          title: 'Hosting and request data',
          text: 'Cloudflare hosts and delivers this site. Requests may involve information such as your IP address, browser, requested URL and request time for delivery, security and abuse prevention. Cloudflare processes this information under its own terms and privacy policy.',
          link: 'cloudflare',
        },
        {
          title: 'Preferences on your device',
          text: 'Browser local storage is used to remember interface preferences such as a language-prompt choice. This data stays in that browser unless you clear it. You can remove it through your browser’s site-data controls; saved preferences will then reset.',
        },
        {
          title: 'Analytics, advertising and payments',
          text: 'We use Google Analytics 4 and Plausible, hosted at plausible.shipsolo.io and pl.gameradar.online, to understand site visits through aggregate statistics. Google Analytics may use cookies and send visit data to Google. You can manage cookies through your browser settings. Adsterra banners, native ads and Social Bar load third-party resources; Adsterra and its providers may process device and visit data to deliver ads. See its privacy policy below. This site does not embed session-recording scripts, offer user accounts or take payments. We do not sell personal information.',
          link: 'adsterra',
        },
        {
          title: 'External links and messages',
          text: 'Following a link to Steam, GitHub or another service takes you to that service’s own privacy practices. If you post a GitHub issue, your profile and message may be public. Share only the information needed to explain your request.',
        },
        {
          title: 'Questions and changes',
          text: 'For a privacy question, open an initial website issue without sensitive personal details. We will update this policy when the site’s data practices change and show the revision date on this page.',
          link: 'feedback',
        },
      ],
    },
    'terms-of-service': {
      title: 'Terms of use',
      description:
        'Terms for using the independent Find the Needle guide, including content, external links, intellectual property and corrections.',
      intro:
        'These terms apply to your use of findtheneedle.site. The site provides free game information and is separate from the game, its developer, publisher and Steam.',
      sections: [
        {
          title: 'Guide information',
          text: 'We aim to provide useful, accurate information, but game updates can change mechanics, requirements and availability. Check official sources before purchases or changes affecting your saved progress. We do not guarantee uninterrupted access or that every guide remains current.',
        },
        {
          title: 'Game and website content',
          text: 'Find the Needle names, artwork and screenshots remain the property of their respective rights holders, including FindTheNeedleDev and Hay Passionates. Their appearance here does not imply endorsement. Do not assume that game media can be reused simply because it appears on this website.',
        },
        {
          title: 'Acceptable use',
          text: 'Use the site lawfully. Do not attempt to compromise its security, disrupt access, or submit harmful or unlawful material through the linked feedback channels.',
        },
        {
          title: 'Third-party services',
          text: 'Steam, GitHub and other linked sites have their own terms. We do not control their content, purchases, account decisions or availability. This site does not sell the game or provide refunds.',
        },
        {
          title: 'Corrections and updates',
          text: 'Send website concerns or rights enquiries through the issue tracker, identifying the relevant page. These terms may change as the site changes; the date on this page identifies the current revision. Nothing here limits rights that cannot be excluded under applicable law.',
          link: 'feedback',
        },
      ],
    },
  },
  de: {
    faq: {
      title: 'Find the Needle: häufige Fragen',
      description:
        'Antworten zu Veröffentlichung, kostenloser Demo, Plattformen und Einzelspielermodus von Find the Needle mit offiziellen Steam-Links.',
      intro:
        'Die kostenlose Demo ist bereits verfügbar. Für das vollständige Spiel nennt Steam das vierte Quartal 2026. Auf der am 27. September 2026 geprüften Seite steht kein genauer Veröffentlichungstag.',
      sections: [
        {
          title: 'Wo bekomme ich die Demo?',
          text: 'Find the Needle Demo erschien am 10. September 2026. Installiere sie über ihren eigenen Steam-Eintrag. Wenn du das vollständige Spiel auf die Wunschliste setzt, wird die Demo dadurch nicht installiert.',
          link: 'demo',
        },
        {
          title: 'Worum geht es im Spiel?',
          text: 'Suche Nadeln im Heuhaufen, verkaufe Heu und investiere in Werkzeuge und Maschinen. Aus der Handarbeit entsteht nach und nach eine Fabrik mit Förderbändern, Ballenpressen, Scannern und Roboterarmen.',
          link: 'store',
        },
        {
          title: 'Gibt es einen Mehrspielermodus?',
          text: 'Steam führt Find the Needle als Einzelspielerspiel. Ein kooperativer oder kompetitiver Mehrspielermodus wird dort nicht angekündigt.',
        },
        {
          title: 'Läuft es auf Mac, Linux oder Konsolen?',
          text: 'Die angekündigte Steam-Version unterstützt Windows. Native Versionen für macOS und Linux sowie eine Konsolenveröffentlichung sind dort nicht bestätigt. Zur Leistung über Kompatibilitätsschichten oder auf Handhelds liegen uns keine verifizierten Ergebnisse vor.',
        },
        {
          title: 'Welche Sprachen werden unterstützt?',
          text: 'Steam nennt unter anderem Englisch, Französisch, Deutsch, Spanisch (Spanien) und Russisch. Prüfe vor dem Download die Sprachtabelle. Die verfügbaren Übersetzungen dieser Website findest du in der Sprachauswahl.',
          link: 'store',
        },
        {
          title: 'Wird der Demo-Spielstand übernommen?',
          text: 'Die geprüften Shop-Informationen bestätigen keine Übernahme in das vollständige Spiel. Bewahre deine Demo-Spielstände auf und warte auf eine ausdrückliche Ankündigung, bevor du mit einer Übertragung rechnest.',
        },
      ],
    },
    'system-requirements': {
      title: 'Find the Needle: Systemanforderungen',
      description:
        'Offizielle minimale und empfohlene Windows-Anforderungen für Find the Needle, Vulkan-Unterstützung und Hinweise zu integrierter Grafik.',
      intro:
        'Laut Steam werden Windows und eine dedizierte Grafikkarte benötigt. Integrierte Grafik wird ausdrücklich nicht unterstützt und kann Abstürze verursachen. Geprüft am 27. September 2026.',
      sections: [
        {
          title: 'Vor der Installation auf einem Laptop',
          text: 'Vergleiche das genaue GPU-Modell und den Videospeicher, nicht nur den Arbeitsspeicher des Laptops. Die GPU muss Vulkan 1.3 unterstützen. Bei einem Laptop mit zwei GPUs sollte das Spiel die dedizierte Grafikkarte verwenden.',
        },
        {
          title: 'Große Fabriken und Handhelds',
          text: 'Der Entwickler weist darauf hin, dass sehr große Fabriken den Prozessor stark belasten. Die Mindestanforderungen garantieren keine bestimmte Bildrate. Verifizierte Steam-Deck-Messungen oder native Anforderungen für macOS und Linux liegen uns nicht vor.',
          link: 'store',
        },
      ],
    },
    troubleshooting: {
      title: 'Find the Needle: Probleme beheben',
      description:
        'Erste Prüfungen bei Startproblemen und Abstürzen der Demo: unterstützte Grafik, Steam-Dateiprüfung und hilfreiche Angaben für Fehlermeldungen.',
      intro:
        'Startet die Demo nicht, prüfe zuerst die Grafikhardware: Die offiziellen Anforderungen schließen integrierte Grafik aus und verlangen Vulkan 1.3. Die folgenden Schritte sind allgemeine Steam-Prüfungen, keine bestätigten Lösungen für einen bestimmten Spielfehler.',
      sections: [
        {
          title: '1. Hardware und Updates prüfen',
          text: 'Vergleiche deinen PC mit den Systemanforderungen. Schließe ausstehende Steam-Downloads ab, starte den Computer neu und installiere den aktuellen Grafiktreiber des GPU-Herstellers. Wähle auf einem Laptop mit zwei GPUs in den Windows-Grafikeinstellungen die dedizierte GPU für das Spiel.',
        },
        {
          title: '2. Installation überprüfen',
          text: 'Klicke in der Steam-Bibliothek mit der rechten Maustaste auf Find the Needle Demo. Öffne Eigenschaften → Installierte Dateien → Dateien auf Fehler überprüfen. Warte auf den Abschluss und starte erneut. Teste nach jeder Änderung, damit du erkennst, was geholfen hat.',
          link: 'verify',
        },
        {
          title: '3. Wenn eine große Fabrik langsamer läuft',
          text: 'Schließe andere anspruchsvolle Programme und prüfe, ob das Problem nur in der großen Fabrik auftritt. Laut Entwickler belasten große Fabriken die CPU besonders stark. Eine niedrigere Auflösung allein behebt dieses Limit möglicherweise nicht.',
        },
        {
          title: '4. Einen reproduzierbaren Fehler melden',
          text: 'Nenne Demo oder Vollversion, Windows-Version, CPU, GPU, Treiberversion, den genauen Fehlertext und die Schritte zur Reproduktion. Entferne persönliche Daten aus Screenshots. Bewahre bestehende Spielstände auf und lösche ihre Ordner nicht als ersten Reparaturversuch.',
          link: 'community',
        },
      ],
    },
    about: {
      title: 'Über diesen Find-the-Needle-Guide',
      description:
        'Informationen zum unabhängigen Find-the-Needle-Fan-Guide, seinen Quellen, Korrekturen und der Beziehung zu den Entwicklern.',
      intro:
        'findtheneedle.site ist ein unabhängiger, inoffizieller Guide zu Find the Needle. Er hilft beim Einstieg in die Demo, beim Planen der ersten Fabrik und bei praktischen Fragen vor dem Spielen.',
      sections: [
        {
          title: 'Unabhängig von den Entwicklern',
          text: 'Diese Website wird nicht von FindTheNeedleDev, Hay Passionates oder Valve betrieben, unterstützt oder gesponsert. Find the Needle wird von FindTheNeedleDev entwickelt und von Hay Passionates veröffentlicht. Spielnamen, Grafiken und Screenshots gehören den jeweiligen Rechteinhabern.',
        },
        {
          title: 'Unsere Quellen',
          text: 'Angaben zu Veröffentlichung und Hardware stammen aus den offiziellen Steam-Einträgen. Die Guides unterscheiden angekündigte Funktionen von praktischen Vorschlägen. Demo und Vollversion können sich ändern; beachte deshalb das jeweilige Aktualisierungsdatum.',
          link: 'store',
        },
        {
          title: 'Korrekturen und Beiträge',
          text: 'Wenn ein Guide falsch oder eine Übersetzung unklar ist, sende die Seiten-URL, die Korrektur und einen Screenshot oder offiziellen Beleg. Gib an, welche Spiel- oder Demo-Version du verwendet hast.',
          link: 'feedback',
        },
      ],
    },
    contact: {
      title: 'Kontakt und Korrekturen',
      description:
        'Melde Fehler im Find-the-Needle-Guide oder finde die offizielle Steam-Community für Fragen zum Spiel.',
      intro:
        'Melde fehlerhafte Angaben, defekte Links oder Übersetzungsprobleme als Issue im GitHub-Repository der Website. Spielfehler und Kaufanfragen gehören zu den offiziellen Spielkanälen oder zum Steam-Support.',
      sections: [
        {
          title: 'Website-Fehler melden',
          text: 'Nenne die Seiten-URL, Sprache, den Fehler und deinen Korrekturvorschlag. Ein Beleg oder Screenshot hilft bei der Prüfung. Zum Schreiben ist ein GitHub-Konto nötig. Issues sind öffentlich: Veröffentliche keine Passwörter, Zahlungsdaten oder anderen sensiblen Informationen.',
          link: 'feedback',
        },
        {
          title: 'Hilfe zum Spiel erhalten',
          text: 'In der Steam-Community findest du Entwicklerankündigungen und Diskussionen zum Spiel. Diese Fan-Website hat keinen Zugriff auf Spielstände, Steam-Konten oder Käufe und kann keine Rückerstattungen ausstellen.',
          link: 'community',
        },
        {
          title: 'Rechte und Datenschutz',
          text: 'Stelle eine erste Anfrage über den Issue-Tracker und nenne die betroffene Seite oder das Material. Veröffentliche keine Ausweisdokumente oder vertraulichen Nachweise in einem öffentlichen Issue.',
          link: 'feedback',
        },
      ],
    },
    'privacy-policy': {
      title: 'Datenschutzerklärung',
      description:
        'Wie findtheneedle.site Hosting-Anfragen, Browser-Einstellungen, Besuchsstatistiken und externe Links behandelt.',
      intro:
        'Diese Erklärung gilt für findtheneedle.site, einen unabhängigen Guide zu Find the Needle. Zum Lesen brauchst du kein Konto, keine Zahlung und kein Formular.',
      sections: [
        {
          title: 'Hosting und Anfragedaten',
          text: 'Cloudflare hostet und überträgt diese Website. Anfragen können IP-Adresse, Browser, angeforderte URL und Zeitpunkt enthalten, um Inhalte auszuliefern, Sicherheit zu gewährleisten und Missbrauch zu verhindern. Cloudflare verarbeitet diese Daten nach seinen eigenen Bedingungen und seiner Datenschutzerklärung.',
          link: 'cloudflare',
        },
        {
          title: 'Einstellungen auf deinem Gerät',
          text: 'Im lokalen Browserspeicher werden Oberflächeneinstellungen gespeichert, etwa deine Auswahl beim Sprachhinweis. Diese Daten bleiben im jeweiligen Browser, bis sie gelöscht werden. Über die Website-Dateneinstellungen deines Browsers kannst du sie entfernen; gespeicherte Einstellungen werden dann zurückgesetzt.',
        },
        {
          title: 'Analyse, Werbung und Zahlungen',
          text: 'Wir verwenden Google Analytics 4 und das unter plausible.shipsolo.io und pl.gameradar.online gehostete Plausible, um Website-Besuche anhand zusammengefasster Statistiken auszuwerten. Google Analytics kann Cookies verwenden und Besuchsdaten an Google senden. Cookies kannst du in den Einstellungen deines Browsers verwalten. Adsterra-Banner, native Anzeigen und Social Bar laden Ressourcen von Drittanbietern; Adsterra und seine Dienstleister können Geräte- und Besuchsdaten zur Anzeigenauslieferung verarbeiten. Die Datenschutzerklärung ist unten verlinkt. Die Website bindet keine Sitzungsaufzeichnungsskripte ein, bietet keine Nutzerkonten an und nimmt keine Zahlungen entgegen. Wir verkaufen keine personenbezogenen Daten.',
          link: 'adsterra',
        },
        {
          title: 'Externe Links und Nachrichten',
          text: 'Wenn du Steam, GitHub oder einen anderen Dienst über einen Link öffnest, gelten dessen Datenschutzpraktiken. Bei einem GitHub-Issue können dein Profil und deine Nachricht öffentlich sein. Teile nur Informationen, die für deine Anfrage nötig sind.',
        },
        {
          title: 'Fragen und Änderungen',
          text: 'Stelle Datenschutzfragen zunächst als Website-Issue ohne sensible persönliche Angaben. Ändern sich die Datenpraktiken der Website, aktualisieren wir diese Erklärung und das auf dieser Seite angegebene Datum.',
          link: 'feedback',
        },
      ],
    },
    'terms-of-service': {
      title: 'Nutzungsbedingungen',
      description:
        'Bedingungen für die Nutzung des unabhängigen Find-the-Needle-Guides: Inhalte, externe Links, geistiges Eigentum und Korrekturen.',
      intro:
        'Diese Bedingungen gelten für findtheneedle.site. Die Website bietet kostenlose Spielinformationen und ist vom Spiel, seinem Entwickler, Publisher und Steam unabhängig.',
      sections: [
        {
          title: 'Informationen in den Guides',
          text: 'Wir bemühen uns um hilfreiche und korrekte Informationen. Updates können jedoch Spielmechaniken, Anforderungen und Verfügbarkeit ändern. Prüfe vor Käufen oder Änderungen an deinem Spielfortschritt offizielle Quellen. Wir garantieren weder unterbrechungsfreien Zugriff noch die ständige Aktualität aller Guides.',
        },
        {
          title: 'Spiel- und Website-Inhalte',
          text: 'Namen, Grafiken und Screenshots von Find the Needle bleiben Eigentum der jeweiligen Rechteinhaber, darunter FindTheNeedleDev und Hay Passionates. Ihre Verwendung bedeutet keine Unterstützung dieser Website. Die Veröffentlichung von Spielmedien hier erteilt dir nicht automatisch ein Recht zur Weiterverwendung.',
        },
        {
          title: 'Zulässige Nutzung',
          text: 'Nutze die Website im Rahmen geltenden Rechts. Versuche nicht, ihre Sicherheit zu beeinträchtigen, den Zugang zu stören oder schädliche beziehungsweise rechtswidrige Inhalte über die verlinkten Meldekanäle einzureichen.',
        },
        {
          title: 'Dienste Dritter',
          text: 'Steam, GitHub und andere verlinkte Websites haben eigene Bedingungen. Wir kontrollieren weder deren Inhalte, Käufe, Kontoentscheidungen noch ihre Verfügbarkeit. Diese Website verkauft das Spiel nicht und gewährt keine Rückerstattungen.',
        },
        {
          title: 'Korrekturen und Aktualisierungen',
          text: 'Sende Anliegen zur Website oder zu Rechten über den Issue-Tracker und nenne die betreffende Seite. Diese Bedingungen können sich mit der Website ändern; das Datum nennt die aktuelle Fassung. Gesetzlich unabdingbare Rechte werden durch diese Bedingungen nicht eingeschränkt.',
          link: 'feedback',
        },
      ],
    },
  },
  es: {
    faq: {
      title: 'Preguntas frecuentes de Find the Needle',
      description:
        'Fecha de lanzamiento, demo gratuita, plataformas y modo para un jugador de Find the Needle, con enlaces oficiales de Steam.',
      intro:
        'La demo gratuita ya está disponible. Steam anuncia el juego completo para el cuarto trimestre de 2026, sin un día concreto en la ficha consultada el 27 de septiembre de 2026.',
      sections: [
        {
          title: '¿Dónde se descarga la demo?',
          text: 'Find the Needle Demo se lanzó el 10 de septiembre de 2026. Instálala desde su propia ficha de Steam: añadir el juego completo a tu lista de deseados no instala la demo.',
          link: 'demo',
        },
        {
          title: '¿En qué consiste el juego?',
          text: 'Busca agujas en un pajar, vende el heno e invierte en herramientas y maquinaria. El trabajo manual se transforma en una fábrica con cintas transportadoras, empacadoras, escáneres y brazos robóticos.',
          link: 'store',
        },
        {
          title: '¿Tiene multijugador?',
          text: 'Steam presenta Find the Needle como un juego para un jugador. La ficha no anuncia modos cooperativos ni multijugador competitivo.',
        },
        {
          title: '¿Se puede jugar en Mac, Linux o consolas?',
          text: 'La versión anunciada en Steam es compatible con Windows. La ficha no ofrece versiones nativas para macOS o Linux ni confirma una versión para consolas. No tenemos resultados verificados de rendimiento mediante capas de compatibilidad o en dispositivos portátiles.',
        },
        {
          title: '¿Qué idiomas incluye?',
          text: 'Steam indica, entre otros, inglés, francés, alemán, español de España y ruso. Consulta la tabla de idiomas antes de descargarlo. El selector de idiomas de esta web muestra las traducciones disponibles.',
          link: 'store',
        },
        {
          title: '¿Se conserva el progreso de la demo?',
          text: 'La información de la tienda consultada no confirma la transferencia de partidas al juego completo. Conserva tus partidas y espera un anuncio explícito antes de contar con esa posibilidad.',
        },
      ],
    },
    'system-requirements': {
      title: 'Requisitos de Find the Needle',
      description:
        'Requisitos mínimos y recomendados de Find the Needle para Windows: tarjeta dedicada, Vulkan y advertencia sobre gráficos integrados.',
      intro:
        'La ficha de Steam exige Windows y una tarjeta gráfica dedicada. Los gráficos integrados no son compatibles y pueden provocar cierres inesperados. Datos comprobados el 27 de septiembre de 2026.',
      sections: [
        {
          title: 'Antes de instalarlo en un portátil',
          text: 'Compara el modelo exacto de GPU y su memoria de vídeo, no solo la RAM del equipo. La GPU debe admitir Vulkan 1.3. Si el portátil tiene gráficos integrados y dedicados, comprueba que el juego utilice la tarjeta dedicada.',
        },
        {
          title: 'Fábricas grandes y dispositivos portátiles',
          text: 'El desarrollador señala que las fábricas muy grandes exigen mucho al procesador. Cumplir los requisitos mínimos no garantiza una tasa de imágenes concreta. No contamos con pruebas verificadas en Steam Deck ni con requisitos nativos para macOS o Linux.',
          link: 'store',
        },
      ],
    },
    troubleshooting: {
      title: 'Solucionar problemas de Find the Needle',
      description:
        'Comprobaciones iniciales para cierres y errores al iniciar la demo: GPU compatible, archivos de Steam y datos útiles para comunicar fallos.',
      intro:
        'Si la demo no se inicia, revisa primero la tarjeta gráfica: los requisitos oficiales excluyen los gráficos integrados y exigen Vulkan 1.3. Estos pasos son comprobaciones generales de Steam, no soluciones confirmadas para un fallo concreto del juego.',
      sections: [
        {
          title: '1. Revisar el equipo y las actualizaciones',
          text: 'Compara tu PC con los requisitos. Termina las descargas pendientes de Steam, reinicia el equipo e instala el controlador gráfico actual del fabricante. En portátiles con dos GPU, selecciona la dedicada para el juego en la configuración de gráficos de Windows.',
        },
        {
          title: '2. Verificar la instalación',
          text: 'En la biblioteca de Steam, haz clic derecho en Find the Needle Demo y abre Propiedades → Archivos instalados → Verificar integridad de los archivos del juego. Espera a que termine y vuelve a iniciarlo. Prueba después de cada cambio para identificar qué ha ayudado.',
          link: 'verify',
        },
        {
          title: '3. Si una fábrica grande se ralentiza',
          text: 'Cierra otras aplicaciones exigentes y comprueba si el problema solo aparece en la fábrica grande. El desarrollador indica que estas fábricas cargan más la CPU; reducir únicamente la resolución puede no solucionar esa limitación.',
        },
        {
          title: '4. Comunicar un problema reproducible',
          text: 'Indica si juegas a la demo, tu versión de Windows, CPU, GPU, versión del controlador, mensaje exacto del error y pasos para reproducirlo. Si adjuntas una captura, elimina los datos personales. Conserva las partidas guardadas: no borres sus carpetas como primera medida.',
          link: 'community',
        },
      ],
    },
    about: {
      title: 'Acerca de esta guía de Find the Needle',
      description:
        'Información sobre la guía independiente de Find the Needle, sus fuentes, correcciones y relación con los creadores del juego.',
      intro:
        'findtheneedle.site es una guía independiente y no oficial de Find the Needle. Ayuda a conocer la demo, planificar la primera fábrica y consultar información práctica antes de jugar.',
      sections: [
        {
          title: 'Independiente de los creadores',
          text: 'FindTheNeedleDev, Hay Passionates y Valve no administran, respaldan ni patrocinan esta web. Find the Needle está desarrollado por FindTheNeedleDev y publicado por Hay Passionates. Los nombres, ilustraciones y capturas del juego pertenecen a sus respectivos titulares.',
        },
        {
          title: 'Nuestras fuentes',
          text: 'Los datos sobre lanzamiento y hardware proceden de las fichas oficiales de Steam. Las guías distinguen las funciones anunciadas de las sugerencias prácticas. La demo y el juego completo pueden cambiar; ten en cuenta la fecha de actualización de cada dato.',
          link: 'store',
        },
        {
          title: 'Correcciones y aportaciones',
          text: 'Si encuentras un error o una traducción poco clara, envía la URL, la corrección y una captura o un enlace oficial que la respalde. Indica qué versión de la demo o del juego has utilizado.',
          link: 'feedback',
        },
      ],
    },
    contact: {
      title: 'Contacto y correcciones',
      description:
        'Comunica errores de la guía Find the Needle o visita la comunidad oficial de Steam para preguntas sobre el juego.',
      intro:
        'Para corregir el sitio, comunicar un enlace roto o mejorar una traducción, abre una incidencia en el repositorio de GitHub. Los fallos del juego y las dudas sobre compras deben dirigirse a los canales oficiales o al soporte de Steam.',
      sections: [
        {
          title: 'Comunicar un error del sitio',
          text: 'Incluye la URL, el idioma, el problema y tu propuesta de corrección. Un enlace a la fuente o una captura ayuda a comprobarlo. Necesitas una cuenta de GitHub para publicar. Las incidencias son públicas: no incluyas contraseñas, datos de pago ni información sensible.',
          link: 'feedback',
        },
        {
          title: 'Obtener ayuda con el juego',
          text: 'En la comunidad de Steam encontrarás anuncios del desarrollador y conversaciones sobre el juego. Esta web de fans no puede acceder a tus partidas, cuenta de Steam o compras, ni tramitar reembolsos.',
          link: 'community',
        },
        {
          title: 'Derechos y privacidad',
          text: 'Usa el registro de incidencias para una primera consulta e identifica la página o material afectado. No publiques documentos de identidad ni pruebas confidenciales en una incidencia pública.',
          link: 'feedback',
        },
      ],
    },
    'privacy-policy': {
      title: 'Política de privacidad',
      description:
        'Cómo trata findtheneedle.site las solicitudes de alojamiento, preferencias del navegador, estadísticas de visitas y enlaces externos.',
      intro:
        'Esta política cubre findtheneedle.site, una guía independiente de Find the Needle. No necesitas una cuenta, un pago ni enviar un formulario para leer el sitio.',
      sections: [
        {
          title: 'Alojamiento y datos de solicitudes',
          text: 'Cloudflare aloja y distribuye esta web. Las solicitudes pueden incluir la dirección IP, navegador, URL solicitada y hora para servir el contenido, mantener la seguridad y prevenir abusos. Cloudflare trata esa información conforme a sus propias condiciones y política de privacidad.',
          link: 'cloudflare',
        },
        {
          title: 'Preferencias en tu dispositivo',
          text: 'El almacenamiento local del navegador guarda preferencias de la interfaz, como tu elección en el aviso de idioma. Estos datos permanecen en ese navegador hasta que los borres. Puedes eliminarlos desde la configuración de datos de sitios; las preferencias guardadas se restablecerán.',
        },
        {
          title: 'Analítica, publicidad y pagos',
          text: 'Utilizamos Google Analytics 4 y Plausible, alojado en plausible.shipsolo.io y pl.gameradar.online, para conocer las visitas al sitio mediante estadísticas agregadas. Google Analytics puede utilizar cookies y enviar datos de las visitas a Google. Puedes gestionar las cookies en los ajustes de tu navegador. Los banners, anuncios nativos y Social Bar de Adsterra cargan recursos de terceros; Adsterra y sus proveedores pueden tratar datos del dispositivo y de las visitas para mostrar anuncios. Consulta su política de privacidad enlazada abajo. El sitio no incorpora scripts de grabación de sesiones, no ofrece cuentas de usuario ni acepta pagos. No vendemos información personal.',
          link: 'adsterra',
        },
        {
          title: 'Enlaces externos y mensajes',
          text: 'Al seguir un enlace a Steam, GitHub u otro servicio, se aplican sus propias prácticas de privacidad. Si publicas una incidencia en GitHub, tu perfil y mensaje pueden ser públicos. Comparte solo la información necesaria para explicar tu solicitud.',
        },
        {
          title: 'Preguntas y cambios',
          text: 'Para una consulta de privacidad, abre una primera incidencia sin datos personales sensibles. Actualizaremos esta política cuando cambien las prácticas de datos del sitio e indicaremos la fecha de revisión en esta página.',
          link: 'feedback',
        },
      ],
    },
    'terms-of-service': {
      title: 'Condiciones de uso',
      description:
        'Condiciones de la guía independiente Find the Needle: información, enlaces externos, propiedad intelectual y correcciones.',
      intro:
        'Estas condiciones se aplican a findtheneedle.site. La web ofrece información gratuita y es independiente del juego, su desarrollador, editor y Steam.',
      sections: [
        {
          title: 'Información de las guías',
          text: 'Intentamos ofrecer información útil y precisa, pero las actualizaciones pueden modificar mecánicas, requisitos y disponibilidad. Consulta fuentes oficiales antes de comprar o realizar cambios que afecten a tus partidas. No garantizamos el acceso ininterrumpido ni que todas las guías permanezcan actualizadas.',
        },
        {
          title: 'Contenidos del juego y del sitio',
          text: 'Los nombres, ilustraciones y capturas de Find the Needle siguen perteneciendo a sus titulares, incluidos FindTheNeedleDev y Hay Passionates. Su aparición aquí no implica respaldo. La publicación de material del juego en esta web no concede automáticamente permiso para reutilizarlo.',
        },
        {
          title: 'Uso permitido',
          text: 'Utiliza el sitio de forma legal. No intentes comprometer su seguridad, interrumpir el acceso ni enviar material dañino o ilegal a través de los canales de contacto enlazados.',
        },
        {
          title: 'Servicios externos',
          text: 'Steam, GitHub y otros sitios enlazados tienen sus propias condiciones. No controlamos sus contenidos, compras, decisiones sobre cuentas ni disponibilidad. Esta web no vende el juego ni realiza reembolsos.',
        },
        {
          title: 'Correcciones y actualizaciones',
          text: 'Envía consultas sobre el sitio o derechos mediante el registro de incidencias, indicando la página correspondiente. Estas condiciones pueden cambiar con el sitio; la fecha identifica la revisión actual. Nada de lo aquí indicado limita derechos irrenunciables conforme a la legislación aplicable.',
          link: 'feedback',
        },
      ],
    },
  },
  ru: {
    faq: {
      title: 'Find the Needle: частые вопросы',
      description:
        'Срок выхода, бесплатная демоверсия, платформы и одиночный режим Find the Needle со ссылками на официальные страницы Steam.',
      intro:
        'Бесплатная демоверсия уже доступна. Выход полной версии в Steam запланирован на IV квартал 2026 года. На странице, проверенной 27 сентября 2026 года, точный день не указан.',
      sections: [
        {
          title: 'Где скачать демоверсию?',
          text: 'Find the Needle Demo вышла 10 сентября 2026 года. Установите её с отдельной страницы Steam. Добавление полной игры в список желаемого не устанавливает демоверсию.',
          link: 'demo',
        },
        {
          title: 'Что нужно делать в игре?',
          text: 'Ищите иглы в стоге сена, продавайте сено и покупайте инструменты и оборудование. Ручная работа постепенно превращается в фабрику с конвейерами, прессами, сканерами и роботизированными манипуляторами.',
          link: 'store',
        },
        {
          title: 'Есть ли мультиплеер?',
          text: 'В Steam Find the Needle указана как одиночная игра. Кооперативный и соревновательный сетевые режимы на странице не заявлены.',
        },
        {
          title: 'Можно ли играть на Mac, Linux или консолях?',
          text: 'Заявленная версия Steam поддерживает Windows. На странице нет нативных версий для macOS и Linux или подтверждения выхода на консолях. Проверенных результатов работы через слои совместимости и на портативных устройствах у нас нет.',
        },
        {
          title: 'Какие языки поддерживаются?',
          text: 'В Steam среди языков указаны английский, французский, немецкий, испанский (Испания) и русский. Перед загрузкой проверьте таблицу языков. Доступные переводы сайта указаны в меню выбора языка.',
          link: 'store',
        },
        {
          title: 'Перенесётся ли прогресс из демоверсии?',
          text: 'Проверенные сведения в магазине не подтверждают перенос сохранений в полную игру. Сохраните файлы демоверсии и дождитесь отдельного объявления, прежде чем рассчитывать на перенос.',
        },
      ],
    },
    'system-requirements': {
      title: 'Системные требования Find the Needle',
      description:
        'Минимальные и рекомендуемые требования Find the Needle для Windows: дискретная видеокарта, Vulkan и ограничения встроенной графики.',
      intro:
        'Страница Steam требует Windows и дискретную видеокарту. Встроенная графика прямо указана как неподдерживаемая и может вызывать сбои. Данные проверены 27 сентября 2026 года.',
      sections: [
        {
          title: 'Перед установкой на ноутбук',
          text: 'Сравните точную модель видеокарты и объём видеопамяти, а не только оперативную память ноутбука. Видеокарта должна поддерживать Vulkan 1.3. Если в ноутбуке есть встроенный и дискретный GPU, убедитесь, что игра использует дискретный.',
        },
        {
          title: 'Крупные фабрики и портативные устройства',
          text: 'Разработчик отмечает, что очень крупные фабрики сильно нагружают процессор. Соответствие минимальным требованиям не гарантирует определённую частоту кадров. У нас нет проверенных замеров на Steam Deck или нативных требований для macOS и Linux.',
          link: 'store',
        },
      ],
    },
    troubleshooting: {
      title: 'Решение проблем с Find the Needle',
      description:
        'Первые действия при сбоях и проблемах запуска демоверсии: совместимая видеокарта, проверка файлов Steam и сведения для сообщения об ошибке.',
      intro:
        'Если демоверсия не запускается, сначала проверьте видеокарту: официальные требования исключают встроенную графику и требуют Vulkan 1.3. Ниже приведены общие проверки Steam, а не подтверждённые исправления конкретного бага игры.',
      sections: [
        {
          title: '1. Проверьте оборудование и обновления',
          text: 'Сравните ПК с системными требованиями. Завершите загрузки Steam, перезагрузите компьютер и установите актуальный драйвер с сайта производителя видеокарты. На ноутбуке с двумя GPU выберите для игры дискретную видеокарту в графических настройках Windows.',
        },
        {
          title: '2. Проверьте установленные файлы',
          text: 'В библиотеке Steam нажмите правой кнопкой на Find the Needle Demo и откройте Свойства → Установленные файлы → Проверить целостность файлов игры. Дождитесь окончания и попробуйте запустить игру. Проверяйте результат после каждого изменения, чтобы понять, что помогло.',
          link: 'verify',
        },
        {
          title: '3. Если большая фабрика начинает тормозить',
          text: 'Закройте другие ресурсоёмкие программы и проверьте, возникает ли замедление только на большой фабрике. По словам разработчика, крупные фабрики сильнее нагружают CPU. Одного снижения разрешения может быть недостаточно.',
        },
        {
          title: '4. Сообщите о воспроизводимой ошибке',
          text: 'Укажите, играете ли вы в демоверсию, версию Windows, процессор, видеокарту, версию драйвера, точный текст ошибки и шаги воспроизведения. При необходимости приложите скриншот без личных данных. Сохраните существующие сохранения: не начинайте диагностику с удаления их папок.',
          link: 'community',
        },
      ],
    },
    about: {
      title: 'Об этом руководстве по Find the Needle',
      description:
        'Независимый фанатский сайт Find the Needle: источники информации, исправления и связь с создателями игры.',
      intro:
        'findtheneedle.site — независимое неофициальное руководство по Find the Needle. Оно помогает разобраться в демоверсии, спланировать первую фабрику и проверить практическую информацию перед игрой.',
      sections: [
        {
          title: 'Независимость от создателей игры',
          text: 'Сайт не управляется, не одобрен и не спонсируется FindTheNeedleDev, Hay Passionates или Valve. Разработчик Find the Needle — FindTheNeedleDev, издатель — Hay Passionates. Названия, иллюстрации и скриншоты игры принадлежат соответствующим правообладателям.',
        },
        {
          title: 'Наши источники',
          text: 'Сведения о выходе и оборудовании взяты из официальных страниц Steam. В руководствах заявленные функции отделены от практических советов. Демоверсия и полная игра могут меняться, поэтому учитывайте дату обновления информации.',
          link: 'store',
        },
        {
          title: 'Исправления и дополнения',
          text: 'Если вы нашли ошибку или неясный перевод, отправьте URL страницы, исправление и подтверждающий скриншот или официальную ссылку. Укажите версию демоверсии или игры, которой вы пользовались.',
          link: 'feedback',
        },
      ],
    },
    contact: {
      title: 'Связь и исправления',
      description:
        'Сообщите об ошибке в руководстве Find the Needle или найдите официальное сообщество Steam для вопросов об игре.',
      intro:
        'Об ошибках сайта, неработающих ссылках и проблемах перевода сообщайте через Issues в репозитории сайта на GitHub. С багами игры и вопросами о покупках обращайтесь в официальные каналы игры или поддержку Steam.',
      sections: [
        {
          title: 'Сообщить о проблеме сайта',
          text: 'Укажите URL, язык, суть ошибки и предлагаемое исправление. Ссылка на источник или скриншот помогут проверке. Для публикации нужна учётная запись GitHub. Обращения публичны: не указывайте пароли, платёжные реквизиты и другие чувствительные данные.',
          link: 'feedback',
        },
        {
          title: 'Получить помощь по игре',
          text: 'В сообществе Steam можно найти объявления разработчика и обсуждения игры. У фанатского сайта нет доступа к вашим сохранениям, учётной записи Steam или покупкам; мы не можем оформить возврат средств.',
          link: 'community',
        },
        {
          title: 'Права и конфиденциальность',
          text: 'Для первого обращения используйте список Issues и укажите затронутую страницу или материал. Не публикуйте документы, удостоверяющие личность, или конфиденциальные доказательства в открытом обращении.',
          link: 'feedback',
        },
      ],
    },
    'privacy-policy': {
      title: 'Политика конфиденциальности',
      description:
        'Как findtheneedle.site обрабатывает запросы к хостингу, настройки браузера, статистику посещений и внешние ссылки.',
      intro:
        'Эта политика относится к findtheneedle.site, независимому руководству по Find the Needle. Для чтения сайта не нужны регистрация, оплата или отправка формы.',
      sections: [
        {
          title: 'Хостинг и данные запросов',
          text: 'Cloudflare размещает сайт и доставляет его содержимое. Запросы могут включать IP-адрес, браузер, запрошенный URL и время для доставки страниц, безопасности и предотвращения злоупотреблений. Cloudflare обрабатывает эту информацию по собственным условиям и политике конфиденциальности.',
          link: 'cloudflare',
        },
        {
          title: 'Настройки на вашем устройстве',
          text: 'Локальное хранилище браузера запоминает настройки интерфейса, например выбор в подсказке языка. Эти данные остаются в данном браузере, пока вы их не удалите. Их можно очистить в настройках данных сайтов; сохранённые предпочтения при этом сбросятся.',
        },
        {
          title: 'Аналитика, реклама и платежи',
          text: 'Мы используем Google Analytics 4 и Plausible, размещённый на plausible.shipsolo.io и pl.gameradar.online, для анализа посещений сайта по сводной статистике. Google Analytics может использовать файлы cookie и передавать данные о посещениях в Google. Управлять файлами cookie можно в настройках браузера. Баннеры, нативная реклама и Social Bar от Adsterra загружают сторонние ресурсы; Adsterra и её поставщики могут обрабатывать данные устройства и посещений для показа рекламы. Ссылка на её политику конфиденциальности приведена ниже. Сайт не встраивает скрипты записи сеансов, не предлагает пользовательских аккаунтов и не принимает платежи. Мы не продаём персональные данные.',
          link: 'adsterra',
        },
        {
          title: 'Внешние ссылки и сообщения',
          text: 'При переходе в Steam, GitHub или другой сервис применяются его правила конфиденциальности. Если вы создаёте Issue на GitHub, профиль и сообщение могут быть общедоступны. Делитесь только сведениями, необходимыми для вашего обращения.',
        },
        {
          title: 'Вопросы и изменения',
          text: 'По вопросам конфиденциальности создайте первоначальное обращение без чувствительных личных данных. При изменении обработки данных мы обновим политику и укажем дату редакции на этой странице.',
          link: 'feedback',
        },
      ],
    },
    'terms-of-service': {
      title: 'Условия использования',
      description:
        'Условия независимого руководства Find the Needle: информация, внешние ссылки, интеллектуальная собственность и исправления.',
      intro:
        'Эти условия относятся к использованию findtheneedle.site. Сайт бесплатно предоставляет информацию и не связан с игрой, её разработчиком, издателем или Steam.',
      sections: [
        {
          title: 'Информация в руководствах',
          text: 'Мы стремимся публиковать полезные и точные сведения, но обновления могут менять механики, требования и доступность игры. Перед покупкой или изменениями, влияющими на сохранения, проверяйте официальные источники. Мы не гарантируем непрерывный доступ или постоянную актуальность каждого руководства.',
        },
        {
          title: 'Материалы игры и сайта',
          text: 'Названия, иллюстрации и скриншоты Find the Needle остаются собственностью их правообладателей, включая FindTheNeedleDev и Hay Passionates. Размещение материалов не означает одобрения сайта. Их наличие здесь не предоставляет автоматического права на повторное использование.',
        },
        {
          title: 'Допустимое использование',
          text: 'Используйте сайт законно. Не пытайтесь нарушать его безопасность, препятствовать доступу или отправлять вредоносные и незаконные материалы через указанные каналы обратной связи.',
        },
        {
          title: 'Сторонние сервисы',
          text: 'Steam, GitHub и другие сайты по ссылкам имеют собственные условия. Мы не контролируем их содержимое, покупки, решения по аккаунтам и доступность. Этот сайт не продаёт игру и не оформляет возвраты.',
        },
        {
          title: 'Исправления и обновления',
          text: 'Отправляйте вопросы о сайте и правах через Issues, указывая соответствующую страницу. Условия могут изменяться вместе с сайтом; дата обозначает текущую редакцию. Эти условия не ограничивают права, которые нельзя исключить по применимому законодательству.',
          link: 'feedback',
        },
      ],
    },
  },
  fr: {
    faq: {
      title: 'Find the Needle : questions fréquentes',
      description:
        'Date de sortie, démo gratuite, plateformes et mode solo de Find the Needle, avec les liens vers les fiches officielles Steam.',
      intro:
        'La démo gratuite est disponible. La sortie du jeu complet est annoncée pour le quatrième trimestre 2026 sur Steam. Aucun jour précis n’est indiqué sur la fiche consultée le 27 septembre 2026.',
      sections: [
        {
          title: 'Où télécharger la démo ?',
          text: 'Find the Needle Demo est disponible depuis le 10 septembre 2026. Installez-la depuis sa propre fiche Steam : ajouter le jeu complet à votre liste de souhaits ne lance pas son installation.',
          link: 'demo',
        },
        {
          title: 'Quel est le principe du jeu ?',
          text: 'Cherchez des aiguilles dans une meule de foin, vendez le foin et achetez des outils et des machines. Le travail manuel laisse progressivement place à une usine de convoyeurs, de presses, de scanners et de bras robotisés.',
          link: 'store',
        },
        {
          title: 'Peut-on jouer à plusieurs ?',
          text: 'Steam présente Find the Needle comme un jeu solo. La fiche n’annonce pas de mode coopératif ni de multijoueur compétitif.',
        },
        {
          title: 'Le jeu existe-t-il sur Mac, Linux ou console ?',
          text: 'La version Steam annoncée prend en charge Windows. Aucune version native macOS ou Linux ni sortie sur console n’est confirmée par cette fiche. Nous ne disposons pas de résultats vérifiés sur les couches de compatibilité ou les consoles portables.',
        },
        {
          title: 'Quelles langues sont proposées ?',
          text: 'Steam indique notamment l’anglais, le français, l’allemand, l’espagnol d’Espagne et le russe. Consultez le tableau des langues avant de télécharger le jeu. Le sélecteur de langue du site indique les traductions disponibles.',
          link: 'store',
        },
        {
          title: 'La progression de la démo sera-t-elle conservée ?',
          text: 'Les informations de la boutique consultées ne confirment pas le transfert des sauvegardes vers le jeu complet. Conservez vos sauvegardes et attendez une annonce explicite avant de compter sur ce transfert.',
        },
      ],
    },
    'system-requirements': {
      title: 'Configuration requise pour Find the Needle',
      description:
        'Configurations Windows minimale et recommandée de Find the Needle : carte graphique dédiée, Vulkan et avertissement sur les GPU intégrés.',
      intro:
        'La fiche Steam exige Windows et une carte graphique dédiée. Les circuits graphiques intégrés ne sont pas pris en charge et peuvent provoquer des plantages. Informations vérifiées le 27 septembre 2026.',
      sections: [
        {
          title: 'Avant l’installation sur un portable',
          text: 'Comparez le modèle exact du GPU et sa mémoire vidéo, pas seulement la mémoire vive du PC. Le GPU doit prendre en charge Vulkan 1.3. Si votre portable possède deux GPU, vérifiez que le jeu utilise la carte dédiée.',
        },
        {
          title: 'Grandes usines et consoles portables',
          text: 'Selon le développeur, les très grandes usines sollicitent fortement le processeur. La configuration minimale ne garantit pas un nombre précis d’images par seconde. Nous n’avons pas de mesures vérifiées sur Steam Deck ni de configuration native macOS ou Linux à communiquer.',
          link: 'store',
        },
      ],
    },
    troubleshooting: {
      title: 'Résoudre les problèmes de Find the Needle',
      description:
        'Premières vérifications pour les plantages de la démo Find the Needle : GPU compatible, fichiers Steam et informations à joindre à un signalement.',
      intro:
        'Si la démo ne démarre pas, vérifiez d’abord votre carte graphique : la configuration officielle exclut les GPU intégrés et exige Vulkan 1.3. Les étapes suivantes sont des vérifications générales pour Steam, pas des correctifs confirmés pour un bug précis du jeu.',
      sections: [
        {
          title: '1. Vérifier le matériel et les mises à jour',
          text: 'Comparez votre PC à la configuration requise. Terminez les téléchargements Steam, redémarrez le PC et installez le pilote graphique actuel fourni par le fabricant. Sur un portable à deux GPU, sélectionnez la carte dédiée dans les paramètres graphiques de Windows.',
        },
        {
          title: '2. Vérifier l’installation',
          text: 'Dans la bibliothèque Steam, faites un clic droit sur Find the Needle Demo, puis ouvrez Propriétés → Fichiers installés → Vérifier l’intégrité des fichiers du jeu. Attendez la fin et réessayez. Testez après chaque modification pour savoir laquelle a été utile.',
          link: 'verify',
        },
        {
          title: '3. Si une grande usine ralentit',
          text: 'Fermez les applications gourmandes et vérifiez si le ralentissement ne se produit que dans la grande usine. Le développeur indique que celles-ci sollicitent davantage le processeur : réduire uniquement la résolution ne résoudra pas forcément cette limite.',
        },
        {
          title: '4. Signaler un problème reproductible',
          text: 'Précisez si vous jouez à la démo, votre version de Windows, votre processeur, votre GPU, la version du pilote, le message d’erreur et les étapes de reproduction. Ajoutez une capture sans données personnelles si nécessaire. Conservez vos sauvegardes : ne commencez pas par supprimer leurs dossiers.',
          link: 'community',
        },
      ],
    },
    about: {
      title: 'À propos de ce guide Find the Needle',
      description:
        'Découvrez ce guide indépendant de Find the Needle, ses sources, les corrections et son lien avec les créateurs du jeu.',
      intro:
        'findtheneedle.site est un guide indépendant et non officiel de Find the Needle. Il aide à découvrir la démo, à préparer sa première usine et à vérifier les informations pratiques avant de jouer.',
      sections: [
        {
          title: 'Un site indépendant',
          text: 'Ce site n’est ni géré, ni approuvé, ni sponsorisé par FindTheNeedleDev, Hay Passionates ou Valve. Find the Needle est développé par FindTheNeedleDev et édité par Hay Passionates. Les noms, illustrations et captures du jeu appartiennent à leurs titulaires respectifs.',
        },
        {
          title: 'Nos sources',
          text: 'Les informations de sortie et de configuration proviennent des fiches officielles Steam. Les guides distinguent les fonctionnalités annoncées des conseils pratiques. La démo et le jeu complet peuvent évoluer : tenez compte de la date de mise à jour des informations.',
          link: 'store',
        },
        {
          title: 'Corrections et contributions',
          text: 'Si un guide comporte une erreur ou une traduction peu claire, transmettez son URL, la correction et une capture ou un lien officiel. Précisez la version du jeu ou de la démo utilisée.',
          link: 'feedback',
        },
      ],
    },
    contact: {
      title: 'Contact et corrections',
      description:
        'Signalez une erreur dans le guide Find the Needle ou accédez à la communauté Steam pour les questions concernant le jeu.',
      intro:
        'Pour une erreur, un lien cassé ou une mauvaise traduction sur le site, ouvrez un ticket dans notre dépôt GitHub. Pour les bugs du jeu et les achats, utilisez les canaux officiels du jeu ou le support Steam.',
      sections: [
        {
          title: 'Signaler un problème du site',
          text: 'Indiquez l’URL, la langue, le problème et la correction proposée. Un lien source ou une capture facilite la vérification. Un compte GitHub est nécessaire. Les tickets sont publics : n’y publiez aucun mot de passe, renseignement de paiement ou autre donnée sensible.',
          link: 'feedback',
        },
        {
          title: 'Obtenir de l’aide pour le jeu',
          text: 'La communauté Steam permet de consulter les annonces et de discuter du jeu. Ce site de fans n’a accès ni à vos sauvegardes, ni à votre compte Steam, ni à vos achats et ne peut pas effectuer de remboursement.',
          link: 'community',
        },
        {
          title: 'Droits et confidentialité',
          text: 'Utilisez le suivi des tickets pour une première demande en précisant la page ou le contenu concerné. Ne publiez pas de pièce d’identité ni de justificatif confidentiel dans un ticket public.',
          link: 'feedback',
        },
      ],
    },
    'privacy-policy': {
      title: 'Politique de confidentialité',
      description:
        'Traitement des requêtes, préférences du navigateur, statistiques de fréquentation et liens externes sur findtheneedle.site.',
      intro:
        'Cette politique concerne findtheneedle.site, guide indépendant de Find the Needle. Aucun compte, paiement ou formulaire n’est requis pour consulter le site.',
      sections: [
        {
          title: 'Hébergement et requêtes',
          text: 'Cloudflare héberge et distribue ce site. Les requêtes peuvent inclure votre adresse IP, votre navigateur, l’URL demandée et l’heure pour assurer la diffusion, la sécurité et la prévention des abus. Cloudflare traite ces informations selon ses propres conditions et sa politique de confidentialité.',
          link: 'cloudflare',
        },
        {
          title: 'Préférences sur votre appareil',
          text: 'Le stockage local du navigateur mémorise des préférences d’interface, comme votre choix concernant la suggestion de langue. Ces données restent dans ce navigateur jusqu’à leur suppression. Vous pouvez les effacer dans les paramètres de données des sites ; les préférences seront alors réinitialisées.',
        },
        {
          title: 'Mesure d’audience, publicité et paiements',
          text: 'Nous utilisons Google Analytics 4 et Plausible, hébergé sur plausible.shipsolo.io et pl.gameradar.online, pour comprendre la fréquentation du site à partir de statistiques agrégées. Google Analytics peut utiliser des cookies et transmettre des données de visite à Google. Vous pouvez gérer les cookies dans les paramètres de votre navigateur. Les bannières, annonces natives et Social Bar d’Adsterra chargent des ressources tierces ; Adsterra et ses prestataires peuvent traiter des données sur votre appareil et vos visites pour diffuser des annonces. Consultez sa politique de confidentialité ci-dessous. Le site n’intègre aucun script d’enregistrement de session, ne propose pas de comptes et ne reçoit pas de paiements. Nous ne vendons pas de données personnelles.',
          link: 'adsterra',
        },
        {
          title: 'Liens externes et messages',
          text: 'En suivant un lien vers Steam, GitHub ou un autre service, vous relevez de ses propres pratiques de confidentialité. Votre profil et votre message peuvent être publics dans un ticket GitHub. Ne partagez que les informations nécessaires à votre demande.',
        },
        {
          title: 'Questions et modifications',
          text: 'Pour une question de confidentialité, ouvrez un premier ticket sans données personnelles sensibles. Cette politique sera mise à jour si les pratiques du site changent ; sa date de révision figure sur cette page.',
          link: 'feedback',
        },
      ],
    },
    'terms-of-service': {
      title: 'Conditions d’utilisation',
      description:
        'Conditions d’utilisation du guide indépendant Find the Needle : informations, liens externes, propriété intellectuelle et corrections.',
      intro:
        'Ces conditions s’appliquent à findtheneedle.site. Le site propose gratuitement des informations et est indépendant du jeu, de son développeur, de son éditeur et de Steam.',
      sections: [
        {
          title: 'Informations des guides',
          text: 'Nous cherchons à fournir des informations utiles et exactes, mais les mises à jour peuvent modifier les mécaniques, la configuration ou la disponibilité du jeu. Vérifiez les sources officielles avant un achat ou une modification touchant vos sauvegardes. L’accès continu et l’actualité de chaque guide ne sont pas garantis.',
        },
        {
          title: 'Contenus du jeu et du site',
          text: 'Les noms, illustrations et captures de Find the Needle restent la propriété de leurs titulaires, notamment FindTheNeedleDev et Hay Passionates. Leur présence n’implique aucune approbation. La publication de médias sur ce site ne vous autorise pas automatiquement à les réutiliser.',
        },
        {
          title: 'Utilisation acceptable',
          text: 'Utilisez le site conformément à la loi. Ne tentez pas de compromettre sa sécurité, d’en perturber l’accès ou d’envoyer du contenu nuisible ou illicite par les canaux de retour indiqués.',
        },
        {
          title: 'Services tiers',
          text: 'Steam, GitHub et les autres sites liés ont leurs propres conditions. Nous ne contrôlons ni leurs contenus, ni les achats, ni les décisions relatives aux comptes, ni leur disponibilité. Ce site ne vend pas le jeu et n’effectue pas de remboursements.',
        },
        {
          title: 'Corrections et mises à jour',
          text: 'Transmettez vos remarques ou demandes relatives aux droits via les tickets en identifiant la page concernée. Ces conditions peuvent évoluer avec le site ; la date indique la révision actuelle. Elles ne limitent pas les droits auxquels la loi applicable ne permet pas de renoncer.',
          link: 'feedback',
        },
      ],
    },
  },
};

function resolveLocale(locale: string): Locale {
  return Object.prototype.hasOwnProperty.call(content, locale)
    ? (locale as Locale)
    : 'en';
}

export function referenceMetadata(key: ReferenceKey, locale: string) {
  const copy = content[resolveLocale(locale)][key];
  return buildPageMetadata({
    titleAbsolute: copy.title,
    description: copy.description,
    path: `/${key}`,
    locale,
  });
}

function RequirementsTable({ locale }: { locale: Locale }) {
  const ui = labels[locale];
  const memoryUnit = locale === 'fr' ? 'Go' : locale === 'ru' ? 'ГБ' : 'GB';
  const rows = [
    ['Windows 10 64-bit', 'Windows 11 64-bit'],
    ['Intel i5-8400 / AMD Ryzen 5 2600', 'AMD Ryzen 5 5600 / Intel i5-12400'],
    [`8 ${memoryUnit}`, `16 ${memoryUnit}`],
    [
      `GTX 1050 Ti / RX 570 (${ui.gpu})`,
      `GTX 1660 Super / RTX 2060 (6 ${memoryUnit} VRAM)`,
    ],
    [ui.storage, ui.storage],
  ];
  return (
    <div className="my-8 overflow-x-auto">
      <table className="site-body-md w-full border-collapse text-left">
        <caption className="site-headline-sm text-site-on-surface mb-4 text-left">
          {ui.platform}
        </caption>
        <thead>
          <tr className="border-site-outline-variant border-b">
            <th scope="col" className="p-3">
              {ui.platform}
            </th>
            <th scope="col" className="p-3">
              {ui.minimum}
            </th>
            <th scope="col" className="p-3">
              {ui.recommended}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([minimum, recommended], index) => (
            <tr
              key={ui.specs[index]}
              className="border-site-outline-variant border-b"
            >
              <th scope="row" className="p-3 font-medium">
                {ui.specs[index]}
              </th>
              <td className="p-3">{minimum}</td>
              <td className="p-3">{recommended}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReferencePage({
  page,
  locale,
}: {
  page: ReferenceKey;
  locale: string;
}) {
  setRequestLocale(locale);
  const language = resolveLocale(locale);
  const copy = content[language][page];
  const ui = labels[language];
  return (
    <PageRoot>
      <PageFrame
        activeHref={`/${page}`}
        breadcrumbs={[
          { label: ui.home, href: '/' },
          { label: copy.title, href: `/${page}` },
        ]}
      >
        <SectionTitle as="h1" title={copy.title} />
        <p className="site-label-sm text-site-on-surface-variant mb-5">
          {ui.updated}
        </p>
        <p className="site-body-lg text-site-on-surface-variant mb-8 max-w-[70ch]">
          {copy.intro}
        </p>
        {page === 'system-requirements' && (
          <RequirementsTable locale={language} />
        )}
        <div className="space-y-8">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                {section.title}
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                {section.text}
              </p>
              {section.link && (
                <a
                  className="site-body-md text-site-primary mt-3 inline-block underline underline-offset-4"
                  href={
                    section.link === 'verify'
                      ? LINKS.verify.replace('/en/', `/${language}/`)
                      : LINKS[section.link]
                  }
                >
                  {ui.links[section.link]}
                </a>
              )}
            </section>
          ))}
        </div>
        {(page === 'faq' || page === 'troubleshooting') && (
          <section className="mt-10">
            <h2 className="site-headline-md text-site-on-surface mb-3">
              {practicalGuides[language][0]}
            </h2>
            <ul className="space-y-3">
              {practicalGuidePaths.map((href, index) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="site-body-md text-site-primary underline underline-offset-4"
                  >
                    {practicalGuides[language][index + 1]}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </PageFrame>
    </PageRoot>
  );
}
