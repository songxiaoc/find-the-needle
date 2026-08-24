# Game Wiki Template

[English](./README.md) · 简体中文

面向**非官方粉丝攻略 / Wiki 站**的 Next.js 模板。壳、主题、SEO、MDX、i18n、部署已经搭好，页面结构留给你。

动手步骤见 **[Quick Start](./docs/QUICKSTART.md)**。

用 Cursor / Claude Code 时，克隆后直接说「把这个模板改成某某游戏的攻略站」即可。仓库内置 [`.claude/skills/game-wiki-quick-start/`](./.claude/skills/game-wiki-quick-start/SKILL.md)，会按 allowlist 改身份、主题、SEO、首页和品牌图，不必对照文档逐项手改。

## 理念

每个游戏的攻略站长得都不一样：魂类要流程 + Boss 页，肉鸽要职业 + 道具 + 配装，卡牌要卡表 + 卡组 + 环境。模板**不假定你的信息架构**，只提供：

- 可配置站点壳 + 五套构建期主题预置
- 经过校验的自适应 UI 配方（`src/generated/ui-recipe.json`）
- 写攻略用的 UI 积木
- SEO 约定（canonical、JSON-LD Article/Breadcrumb、sitemap、robots、llms.txt）
- Fumadocs MDX、next-intl、Tailwind + Radix、OpenNext 部署到 Cloudflare

刻意保持精瘦：这是内容 / SEO 站，**不是** SaaS 脚手架。没有登录、后台、数据库或支付。下面所有文案都是 **「Example Game」占位**，请替换。

## 开箱路由

```
/                       首页 — 可组合 block（src/config/homepage.ts）
/guides                 攻略枢纽（分类来自 src/config/guides.ts）
/guides/bosses          分类列表 — 由 content/guides/bosses/ 自动分组
/guides/bosses/example-boss        种子攻略 — 照这个模式加内容
/database               资料库枢纽（种类来自 src/config/entities.ts）
/database/items         带筛选的条目目录
/database/items/ashen-greatsword   条目详情（content/entities/items/*.json）
/about  /contact  /faq  /system-requirements  /troubleshooting
/privacy-policy  /terms-of-service
/docs  /sitemap.xml  /robots.txt  /llms.txt
```

删掉用不到的页面，按自己的内容结构组装即可。

## 开发

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 。需要 Node 24 和 pnpm 10.34.5。

```bash
pnpm quality:gate   # Prettier + ESLint + tsc + validate:site + build
```

## 接下来改什么

1. [`src/generated/game-config.ts`](./src/generated/game-config.ts) — 站名、域名、游戏名、导航、免责声明
2. 替换 `src/config/guides.ts`、`src/generated/homepage.ts`、`content/` 和 `public/` 里的占位资源
3. 按 [`docs/THEMES.md`](./docs/THEMES.md) 选主题
4. 攻略丢 `content/guides/<分类>/*.mdx`；资料条目丢 `content/entities/<种类>/*.json`（见 [`docs/ENTITIES.md`](./docs/ENTITIES.md)）

更细的逐步说明在 [Quick Start](./docs/QUICKSTART.md)。

## 部署

Cloudflare 已预置：`pnpm cf:deploy`。也可以用根目录 `Dockerfile` 自托管，或把仓库当普通 Next.js 应用导入 Vercel。

## 许可

MIT — [LICENSE](./LICENSE)、第三方声明 [NOTICE](./NOTICE)。贡献见 [CONTRIBUTING.md](./CONTRIBUTING.md)。
