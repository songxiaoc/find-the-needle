import { Link } from '@/core/i18n/navigation';
import { gameConfig } from '@/config/game';
import { siteProfile } from '@/config/site-profile';

export function PatchBar() {
  const status = siteProfile.dataStatus;

  if (!siteProfile.features.patchStatus || !status) {
    return null;
  }

  return (
    <section
      aria-label="Content version status"
      className="border-site-outline-variant bg-site-surface-low border-b"
    >
      <div className="mx-auto flex min-h-10 max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-1 px-6 py-2 md:px-14">
        <span
          aria-hidden="true"
          className="bg-site-green block h-1.5 w-1.5 shrink-0"
        />

        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-site-mono text-site-on-surface-variant text-[10px] font-bold tracking-[0.16em] uppercase">
            {status.label}
          </span>
          <strong className="font-site-mono text-site-on-surface text-xs font-bold tabular-nums">
            v{gameConfig.gameVersion}
          </strong>
        </p>

        {(status.sourceLabel || status.verifiedAt) && (
          <p className="text-site-on-surface-variant flex flex-wrap items-center gap-x-2 text-xs">
            {status.sourceLabel && <span>{status.sourceLabel}</span>}
            {status.sourceLabel && status.verifiedAt && (
              <span aria-hidden="true">·</span>
            )}
            {status.verifiedAt && (
              <span>
                Verified{' '}
                <time dateTime={status.verifiedAt}>{status.verifiedAt}</time>
              </span>
            )}
          </p>
        )}

        {status.changelogHref && (
          <Link
            href={status.changelogHref}
            className="font-site-mono text-site-primary hover:text-site-primary-fixed text-[10px] font-bold tracking-[0.12em] uppercase underline-offset-4 hover:underline sm:ml-auto"
          >
            {status.changelogLabel ?? 'What changed'} →
          </Link>
        )}
      </div>
    </section>
  );
}
