import { referenceMetadata, ReferencePage } from '@/content/reference-copy';

import { locales } from '@/config/locale';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return referenceMetadata('terms-of-service', locale);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ReferencePage page="terms-of-service" locale={locale} />;
}
