# 踩坑记录 —— 用本模板建的真实站点踩过的坑

来之不易的教训，上线前先读。每条都是 症状 → 原因 → 修法。

---

## Cloudflare Workers 部署

### 内页（/guides/\*/\*）全部 404，首页正常
- **症状：** 部署后首页 200，所有 `/guides/<cat>/<slug>` 返回 404（`NoFallbackError`，`x-nextjs-cache: MISS`）。
- **原因：** guides 路由有 `revalidate`（ISR 模式）。Cloudflare Workers 没有缓存后端 → 永远 MISS → 回落到运行时渲染 → Workers 运行时无法访问文件系统 → `getAllGuides()` 返回空 → 404。
- **修法（两步缺一不可）：**
  1. `open-next.config.ts` 加 `incrementalCache: staticAssetsIncrementalCache`（把预渲染页当静态资产 serve）
  2. 所有用 `fs` 读内容的路由文件去掉 `revalidate`，保留 `dynamic = 'force-static'`
- **验证：** 部署日志里出现 `Successfully populated static assets cache`，静态资产上传数量明显增多（如 ~70 → ~170）。

### 首页侧边栏（Wiki Navigation）空白
- **症状：** 首页正常渲染，但右侧 Wiki Navigation 侧边栏空白，分类列表消失。
- **原因：** 首页 `page.tsx` 缺少 `dynamic = 'force-static'` 和 `generateStaticParams`，被 Next.js 判定为动态页在 Workers 运行时渲染；运行时 `getGuideCategories()` 读 fs 失败返回空数组。
- **修法：** `src/app/[locale]/page.tsx` 加：
  ```ts
  export const dynamic = 'force-static';
  export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
  }
  ```
- **注：** 模板已默认包含以上两行，克隆后请勿删除。

### 多语言路由正常但页面上没有切换入口
- **症状：** `/ja/guides/*` 等路由全 200，hreflang 标签也有，但用户看不到语言切换按钮。
- **原因：** 模板曾未内置 LocaleSwitcher 组件。
- **修法：** `src/config/locale/index.ts` 中 `locales` 数组加入目标语言，SiteShell 会自动显示 🌐 LANG 下拉菜单（`locales.length > 1` 时出现）。

### 站点"以为是多语言"，其实悄悄是 en-only
- **症状：** 内容明明翻译了（`content/guides/**/*.es.mdx` 一堆），但线上只有英文，`/es/*` 404；
  或者反过来 `/es/*` 有页面，可 `<title>`/description 全是英文。**两种都不报错**，全靠人眼发现。
- **原因：** 多语言的开关是 `src/config/locale/index.ts` 的 `locales`，它跟内容、跟 message bundle
  是三份独立的东西：
  1. `locales` 漏了 `es` → `*.es.mdx` 永远不进路由（若该篇没有英文兄弟文件，这篇**整个消失**）；
  2. `locales` 有 `es` 但缺 `messages/es/common.json` → `loadMessages()` 静默回落英文，
     于是西语 URL + 西语 hreflang 配英文标题。
- **修法（模板已内置，会在构建期硬失败）：** `src/config/locale/wiring.ts` 的 `assertI18nWiring()`
  在内容扫描时同时校验上面两条，报错会列出具体文件名和该改哪里。**默认就是多语言**——
  `locales` 的模板占位值带 `// scaffold-default:en-only` 标记，`pnpm validate:site` 会 grep 它，
  漏改会直接卡住；真要做 en-only 站也得**显式删掉**这行标记。
- **加语言只改一处：** `SUPPORTED_LOCALES`（语言名 + 文件名后缀识别）与 `locales`（本站启用哪些）
  都在 `src/config/locale/index.ts`。语言名、内容后缀、docs 语言菜单、`zh-CN→zh` 折叠全部从这里派生
  ——**别再在组件或内容层另开一份清单**（历史上曾有 4 份，docs 侧边栏因此给 en-only 站显示"简体中文"）。

### 切到非默认语种后，点任何导航/页脚链接就被踢回英文
- **症状：** `/pt`（等）首页正常，但点 nav、页脚、卡片、面包屑任一链接，URL 丢掉 `/pt` 前缀回到英文版。en-only 站点看不出来，多语言站必中。
- **原因：** 站点组件用了 `next/link` 的 `Link` 配绝对 href（`/guides`、`item.href`），不会带当前 locale 前缀。`localePrefix: 'as-needed'` 只有用 next-intl 自己的 locale-aware `Link` 才会自动补前缀。
- **修法：** 站内链接一律用 `import { Link } from '@/core/i18n/navigation'`，**不要**用 `next/link`。外链（http、mailto）会经 `isLocalizableHref` 原样透传，安全。已在 SiteShell / MobileNav / WikiSidebar / ui 修好——新增站点组件时沿用此约定。语言切换器是例外（见 LocaleSwitcher，path-aware）。

---

## 统计分析（Analytics）

### Google Analytics 静默少报
- **症状：** GA 装了，但 pageview / event 进得很少甚至没有，尤其是快速导航时。
- **原因：** gtag 脚本用 `strategy="afterInteractive"` 加在 `<body>` 末尾。快速加载时，
  首次 pageview 可能在脚本晚加载之前就触发（或没被它捕获）。
- **修法：** 在 `<head>` 里用 `strategy="beforeInteractive"` 加载 GA。`src/app/layout.tsx`
  里已经这么做了，别再挪回去。

### Analytics ID 没文档化，于是没人去配
- **修法：** `.env.example` 已记录 `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`、
  `NEXT_PUBLIC_PLAUSIBLE_ID`、`NEXT_PUBLIC_CLARITY_ID`。每个脚本只在对应 ID 设置时才加载，
  所以留空是安全的。生产环境在 Cloudflare 面板里设（它们是公开的 `NEXT_PUBLIC_*` 值，可以暴露）。

---

## Cloudflare / 部署

### 本地 secrets 泄漏或 wrangler 报错
- **修法：** 真正的生产 secrets 放 Cloudflare 面板，绝不进仓库。
- **`.dev.vars` 已被 gitignore**：需要 `pnpm cf:preview` 时在仓库根目录自己建这个文件，
  内容只需一行 `NEXTJS_ENV=development`。**不要**往里面写真实 secret，生产环境用
  Cloudflare 面板。gitignore 对未跟踪文件生效，所以这个文件默认不会被 commit。

### 别在改动中途手动 `cf:deploy`
- 部署方式是 **push → GitHub → Cloudflare 自动构建**。手动 `pnpm cf:deploy` 会和 CI 构建抢跑。
  改动真正就绪了再 push。

---

## 设计 —— 适用于任何深色游戏主题（尤其是 Pixel HUD 预置）

### 像素字体毁掉可读性和 SEO
- **症状：** 正文用 8-bit 字体（Press Start 2P、Silkscreen…）成段时读不了；跳出率上升、排名下降。
- **原因：** 把「像素主题」错当成「像素字形」。
- **修法：** **像素感来自边框 / 硬阴影 / 斜角，而不是字体。** 用圆润、粗、可读的字面
  （预置用 **Fredoka 700** 做 display + body），像素/窄体字（如果有）只留给极小的大写
  eyebrow，**绝不用于正文**。见 `docs/ui-design-pixel.md`。

### 表面层级太接近 → 没有层次
- **症状：** 卡片融进页面背景，整体看上去很平。
- **原因：** 相邻的 `--site-surface-*` 层级明度太接近（早期某版到处铺满高饱和红，吃光了对比）。
- **修法：** 让 surface 阶梯明显分级（预置六级走 `#141110 → #463A31`）。别把某个 accent 色铺满大面积。

### 深红按钮压在深红横幅上 = 一坨红
- **修法：** 让 `--site-crimson`（按钮/横幅）和 `--site-red`（警告/削弱，珊瑚色调）**保持区分**。
  品牌红 ≠ 警告红。

### 柔和/模糊阴影读不出「像素」感
- **修法：** 所有像素阴影都是零模糊的硬偏移（`4px 4px 0 0 var(--ink)`），烘进 `.px-*` 工具类。
  像素主题里**永远不要**用模糊。

### `clip-path` 阶梯角在移动端会崩
- **症状：** 内容被裁切/溢出，小屏布局错乱。
- **修法：** `.px-corner` 只用于 accent/hero 元素，不要全站铺。

### 页面里散落裸 hex 颜色
- **修法：** 每个颜色都必须是 `tokens.css` / 主题预置里的 token。页面/组件标记里不许有裸 hex——
  否则下次换主题会漏掉它。

### 字重 / CLS
- **修法：** 用 `next/font` 加载字体（自托管、`display: 'swap'`）——见 `fonts.ts`。别用 CDN
  `<link>` 拉字体，那会重新引入布局抖动。

### 装饰性动效忽略了 reduced-motion
- **修法：** 所有 sprite/闪烁/按压动画都在 `pixel-utils.css` 里用
  `@media (prefers-reduced-motion: reduce)` 收口。保持这样。
