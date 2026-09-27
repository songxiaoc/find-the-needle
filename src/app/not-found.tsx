import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { envConfigs } from '@/config';
import { Button } from '@/shared/components/ui/button';

/**
 * Root 404, outside the [locale] segment.
 *
 * It sits above the locale layout, so there is no request locale to translate
 * against and no site chrome to inherit — hence the standalone layout and
 * untranslated copy. Guide and database routes render their own localized
 * not-found states inside the shell.
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Image
        src={envConfigs.app_logo}
        alt={envConfigs.app_name}
        className="site-brandmark"
        width={80}
        height={80}
      />
      <h1 className="text-2xl font-normal">Page not found</h1>
      <p className="text-muted-foreground max-w-prose text-sm">
        This page may have been renamed after a game update.
      </p>
      <Button asChild>
        <Link href="/" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </Button>
    </div>
  );
}
