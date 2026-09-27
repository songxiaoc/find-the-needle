# Find the Needle Wiki

基于 [TomeWiki](https://github.com/tiankonglan/TomeWiki) 的非官方 Find The Needle 游戏指南站。

- 生产域名：https://findtheneedle.site
- 语言：英语、法语、德语、西班牙语、俄语；英语无前缀，其余使用 `/fr`、`/de`、`/es`、`/ru`。
- 技术：Next.js 15、next-intl、MDX、OpenNext、Cloudflare Workers。
- 内容：首页、三篇指南、系统要求、FAQ、排障、About、Contact、Privacy、Terms。
- 素材与事实来源：`docs/research/sources.md`。游戏与素材归原权利人所有；站点不代表游戏开发商或发行商。

## 开发

需要 Node.js 24+ 和 pnpm 10.34.5。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm quality:gate
```

## 内容与语言

游戏配置在 `src/generated/game-config.ts`；首页共用结构与文案在 `src/generated/homepage.ts` 和 `home-copy.ts`；指南使用 `content/guides/guide/*.mdx` 与语言后缀；参考页面正文在 `src/content/reference-copy.tsx`。

更新同一页面时同步五语言版本、来源记录与实际检查日期。不要把正式版商店描述当作 Demo 已包含的完整功能清单。

## 部署

推送 `main` 后 GitHub Actions 验证、构建并部署同一提交。Cloudflare 凭据仅放在 GitHub Actions Secrets：`CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。

Spaceship 仅作为注册商；Cloudflare 提供 DNS、TLS 和 Worker 托管。`www` 自动转到主域名。语言检测仅显示可关闭提示，不改变访问链接的语言。

代码基于 MIT 模板，保留 `LICENSE` 和 `NOTICE`。游戏图片不属于模板 MIT 授权范围。
