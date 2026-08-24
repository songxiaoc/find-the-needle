# Node standalone image. The primary deploy target is Cloudflare Workers via
# OpenNext (`pnpm cf:deploy`); this exists for self-hosting and for Vercel-free
# CI. Node 24 and the pinned pnpm match .github/workflows/ci.yml so a container
# build cannot succeed on a dependency tree that CI never tested.
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
# Pin the package manager rather than `npm i -g pnpm`: an unpinned install
# resolves to whatever is latest on build day, which silently changes the
# lockfile format the build runs against.
RUN corepack enable && corepack prepare pnpm@10.34.5 --activate
WORKDIR /app

FROM base AS deps
# source.config.ts and next.config.mjs are needed at install time, not just at
# build time: the postinstall hook runs fumadocs-mdx, which reads them to
# generate the .source folder that /docs imports from.
COPY package.json pnpm-lock.yaml source.config.ts next.config.mjs ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run unprivileged. .next must exist and be owned by the app user before the
# server starts, or Next fails on first write.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir .next \
  && chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# server.js is emitted by `next build` under output: 'standalone'.
CMD ["node", "server.js"]
