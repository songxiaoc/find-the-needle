# Quick Start

从克隆到本地可预览、改成自己的站，大约 10 分钟。英文总览见 [README](../README.md)，中文总览见 [README.zh-CN.md](../README.zh-CN.md)。

## 0. 环境

- Node.js **24**（当前 LTS；Node 20 已于 2026-03 EOL）
- pnpm **10.34.5**（与 CI 一致；用 pnpm 8 读不了现在的 lockfile）

```bash
node -v    # v24.x
pnpm -v    # 10.34.5
```

没有 pnpm 时：

```bash
corepack enable
corepack prepare pnpm@10.34.5 --activate
```

## 1. 安装并跑起来

```bash
git clone https://github.com/tiankonglan/game-wiki-template.git my-game-wiki
cd my-game-wiki
cp .env.example .env
pnpm install
pnpm dev
```

打开 http://localhost:3000 。看到的是「Example Game」占位站，这是正常的。

需要 `pnpm cf:preview` 时，在仓库根再建一个 `.dev.vars`，内容只有一行：

```
NEXTJS_ENV=development
```

不要往 `.env` / `.dev.vars` 里写真实密钥。分析 ID 配在 Cloudflare 面板或 `.env` 的 `NEXT_PUBLIC_*`，空着脚本不会加载。

## 2. 换成你的站点身份

值写在 [`src/generated/game-config.ts`](../src/generated/game-config.ts)（[`src/config/game.ts`](../src/config/game.ts) 只是类型适配层，一般不用改）：

- `siteName` / `domain`（`origin` 会自动拼成 `https://<domain>`）
- `gameFullName` / `gameShortName` / `tagline` / `gameVersion`
- `nav`、`disclaimer`

改完刷新：顶栏、页脚、`<title>`、sitemap、robots、llms.txt 都从这里派生。

同时替换：

- `public/logo.png`
- `public/favicon.png`（以及 `public/favicon.ico`）
- `public/og-image.png`

**不要**新建 `src/app/favicon.ico`，会和 `public/` 抢路由，导致 `/favicon.ico` 500。

## 3. 选主题

主题是**构建期**选择，不是运行时开关。只改两个文件，指向同一套预置（`tactical` / `pixel` / `neon` / `aurora` / `sakura`）：

1. `src/config/style/active-theme.css` 的 `@import`
2. `src/components/site/active-fonts.ts` 的 export

游戏品牌色只改 `src/components/site/brand.css` 的 `--brand-primary` / `--brand-primary-dim` / `--brand-on-primary`。细则：[`THEMES.md`](./THEMES.md)。

改字体后请**重启** `pnpm dev`。

## 4. 加一篇攻略

在 `content/guides/<分类>/` 下放一个 `.mdx`，文件名即 slug。分类来自**文件夹名**，并须在 `src/config/guides.ts` 的 `GUIDE_CATEGORIES` 里登记：

```mdx
---
title: 'Example Boss Guide'
description: '招式、窗口、掉落。'
date: '2026-08-24'
---

开场一段话，搜索引擎和列表页会当摘要用。

## 阶段一

…
```

对照种子文件：`content/guides/bosses/example-boss.mdx`。不要为每篇攻略再写 `page.tsx`。

## 5. 加一条资料库记录

1. 种类在 `src/config/entities.ts` 的 `ENTITY_KINDS` 里登记（模板自带 `items`）。
2. 在 `content/entities/<kind>/<id>.json` 放一条记录，**文件名必须等于 id**。
3. 构建期用 Zod 校验：字段错、文件名对不上、坏的关联，都会报具体文件名。

对照种子：`content/entities/items/ashen-greatsword.json`。共享的 `database/[[...slug]]` 会渲染枢纽、列表和详情。说明：[`ENTITIES.md`](./ENTITIES.md)。

## 6. 首页积木

首页是 `src/config/homepage.ts` 里的 `HOME_BLOCKS` 有序数组（数据来自 `src/generated/homepage.ts`）。增删、换序都会直接反映到 `/`。可用类型见 [`HOMEPAGE-BLOCKS.md`](./HOMEPAGE-BLOCKS.md)。

## 7. 多语言（可选）

默认 en-only，标记在 `src/generated/site-locales.ts`：

```ts
export const generatedLocales = ['en'] as const; // scaffold-default:en-only
```

要加语言：

1. 把 locale 写进 `generatedLocales`，并**删掉** `scaffold-default:en-only` 注释。
2. 补 `src/config/locale/messages/<lang>/common.json`。
3. 给攻略加后缀文件，例如 `example-boss.zh.mdx`。

语言名、文件后缀、docs 语言菜单都从 `src/config/locale/index.ts` 的 `SUPPORTED_LOCALES` 派生，不要再开一份清单。漏改会被 `wiring.ts` / `pnpm validate:site` 在构建期拦住。踩坑：[`PITFALLS.md`](./PITFALLS.md)。

## 8. 检查与部署

```bash
pnpm quality:gate
```

依次跑 Prettier、ESLint、`tsc`、`validate:site`、生产构建。

```bash
# 先把 wrangler.jsonc 里的 name / 绑定服务名改成你的 worker 名
pnpm cf:preview    # 本地 Worker 预览
pnpm cf:deploy     # 发布
```

自托管用根目录 `Dockerfile`；Vercel 把仓库当普通 Next.js 应用导入即可。

上线前再扫一遍占位文案：「Example Game」、`example-boss`、示例武器。
