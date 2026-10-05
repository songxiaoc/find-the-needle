import { notFound } from 'next/navigation';
import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import {
  FactoryChecklist,
  LineCheck,
  ProductionCalculator,
  type ToolLink,
} from '@/components/site/tools/FactoryTools';
import {
  DIAGNOSIS_LINKS,
  FACTORY_TOOL_IDS,
  getFactoryCopy,
  type FactoryToolId,
} from '@/content/factory-tools';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { getAllEntities } from '@/config/entities-content';
import { getAllGuides } from '@/config/guides-content';
import { locales } from '@/config/locale';
import { localizedUrl } from '@/shared/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;
type Params = { locale: string; slug?: string[] };
function toolId(slug?: string[]): FactoryToolId | undefined {
  if (!slug?.length) return undefined;
  if (slug.length !== 1 || !FACTORY_TOOL_IDS.includes(slug[0] as FactoryToolId))
    notFound();
  return slug[0] as FactoryToolId;
}
export function generateStaticParams() {
  return locales.flatMap((locale) => [
    { locale, slug: [] as string[] },
    ...FACTORY_TOOL_IDS.map((id) => ({ locale, slug: [id] })),
  ]);
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const copy = getFactoryCopy(locale);
  const id = toolId(slug);
  return buildPageMetadata({
    titleTopic: id ? copy.tools[id].title : copy.hub,
    description: id ? copy.tools[id].description : copy.intro,
    path: id ? `/tools/${id}` : '/tools',
    locale,
  });
}
export default async function ToolsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const copy = getFactoryCopy(locale);
  const id = toolId(slug);
  const breadcrumbs = [
    { label: copy.home, href: localizedUrl('/', locale) },
    { label: copy.hub, href: localizedUrl('/tools', locale) },
    ...(id
      ? [
          {
            label: copy.tools[id].title,
            href: localizedUrl(`/tools/${id}`, locale),
          },
        ]
      : []),
  ];
  const names = new Map<string, string>([
    ...getAllEntities(locale).map(
      (entity) => [entity.href, entity.name] as [string, string]
    ),
    ...getAllGuides(locale).map(
      (guide) => [guide.href, guide.title] as [string, string]
    ),
  ]);
  const links: ToolLink[][] = DIAGNOSIS_LINKS.map((paths) =>
    paths.flatMap((href) =>
      names.has(href) ? [{ href, label: names.get(href)! }] : []
    )
  );
  return (
    <PageRoot>
      <PageFrame mode="wide" breadcrumbs={breadcrumbs} activeHref="/tools">
        <header className="mb-8 max-w-3xl">
          <h1 className="site-display-lg text-site-on-surface">
            {id ? copy.tools[id].title : copy.hub}
          </h1>
          <p className="text-site-on-surface-variant mt-4 text-base leading-7">
            {id ? copy.tools[id].description : copy.intro}
          </p>
        </header>
        {!id && (
          <div className="grid gap-6 md:grid-cols-3">
            {FACTORY_TOOL_IDS.map((tool) => (
              <article
                key={tool}
                className="border-site-outline-strong bg-site-surface-container flex flex-col border p-6"
              >
                <h2 className="site-headline-lg">
                  <Link
                    className="hover:text-site-primary"
                    href={`/tools/${tool}`}
                  >
                    {copy.tools[tool].title}
                  </Link>
                </h2>
                <p className="text-site-on-surface-variant my-5 text-sm leading-7">
                  {copy.tools[tool].description}
                </p>
                <Link
                  className="text-site-primary mt-auto min-h-11 py-3 text-sm font-semibold underline underline-offset-4"
                  href={`/tools/${tool}`}
                >
                  {copy.open} →
                </Link>
              </article>
            ))}
          </div>
        )}
        {id === 'line-check' && (
          <LineCheck copy={copy.diagnosis} links={links} />
        )}
        {id === 'checklist' && <FactoryChecklist copy={copy.checklist} />}
        {id === 'production-calculator' && (
          <ProductionCalculator copy={copy.calculator} locale={locale} />
        )}
      </PageFrame>
    </PageRoot>
  );
}
