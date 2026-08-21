// Guides are now read directly via gray-matter + fs in src/config/guides-content.ts.
// fumadocs-mdx only scans content/docs/ for the /docs route.
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// Docs section — consumed by the (docs) route group only.
export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          content: {
            type: 'element',
            tagName: 'span',
            properties: { 'aria-hidden': 'true', className: ['anchor-icon'] },
            children: [{ type: 'text', value: '#' }],
          },
        },
      ],
    ],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultLanguage: 'plaintext',
    },
  },
});
