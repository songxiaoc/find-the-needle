import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { Link } from '@/core/i18n/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

function isExternalHref(href?: string): boolean {
  return !!href && (href.startsWith('http') || href.startsWith('//'));
}

/**
 * Applied to outbound links only. Guide content cites wikis, patch notes and
 * videos on nearly every page, so without `nofollow` the site would spend most
 * of its crawl equity endorsing other people's pages.
 */
const OUTBOUND_LINK_PROPS = {
  target: '_blank',
  rel: 'nofollow noopener noreferrer',
  className: 'text-primary',
} as const;

/**
 * Wrap a link component so outbound links get {@link OUTBOUND_LINK_PROPS} and
 * internal links pass through untouched.
 *
 * Exists as a wrapper rather than a fixed component because fumadocs supplies
 * its own anchor (`createRelativeLink`) for docs pages, and that one still needs
 * the same outbound-link treatment.
 */
export function withNoFollow(LinkComponent: React.ComponentType<AnchorProps>) {
  function NoFollowLink({ href, children, ...props }: AnchorProps) {
    return (
      <LinkComponent
        href={href}
        {...(isExternalHref(href) ? OUTBOUND_LINK_PROPS : {})}
        {...props}
      >
        {children}
      </LinkComponent>
    );
  }

  NoFollowLink.displayName = `withNoFollow(${
    LinkComponent.displayName || LinkComponent.name || 'Link'
  })`;

  return NoFollowLink;
}

function PlainAnchor(props: AnchorProps) {
  if (props.href?.startsWith('/') && !props.href.startsWith('//')) {
    return <Link {...props} href={props.href} />;
  }
  return <a {...props} />;
}

const MdxLink = withNoFollow(PlainAnchor);

/**
 * MDX `src` is a string in hand-written content but a static import object when
 * a bundler resolves it, and both reach this component.
 */
type MdxImageProps = Omit<React.ComponentProps<'img'>, 'src'> & {
  src?: string | { src: string };
};

function MdxImage({ src, alt, className, ...props }: MdxImageProps) {
  return (
    // Markdown image syntax carries no intrinsic dimensions, which next/image
    // requires, so a plain <img> is deliberate here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={typeof src === 'object' && src !== null ? src.src : src}
      alt={alt ?? ''}
      className={cn('rounded-lg border', className)}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

function MdxVideo({ className, ...props }: React.ComponentProps<'video'>) {
  return (
    <video
      className={cn('rounded-md border', className)}
      controls
      loop
      {...props}
    />
  );
}

function MdxPre({ className, ...props }: React.ComponentProps<'pre'>) {
  return (
    <pre
      {...props}
      className={cn(
        'max-w-full overflow-x-auto rounded-lg border p-4',
        className
      )}
    />
  );
}

function MdxTable({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="my-6 max-w-full overflow-x-auto" tabIndex={0}>
      <table {...props} className={cn('w-full min-w-xl', className)} />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const overrides = components ?? {};

  return {
    ...defaultMdxComponents,
    img: MdxImage,
    pre: MdxPre,
    table: MdxTable,
    Video: MdxVideo,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ...overrides,
    // Last word on `a`: whatever anchor is in play — ours or a caller's — has to
    // go through withNoFollow, so this stays after the override spread.
    a: overrides.a
      ? withNoFollow(overrides.a as React.ComponentType<AnchorProps>)
      : MdxLink,
  };
}

export const useMDXComponents = getMDXComponents;
