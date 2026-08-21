# SEO Playbook — 可复用的内容站 SEO 指导

> **这份文档是什么。** 一套从实战项目（Next.js App Router + i18n 内容/数据库站）里提炼出来的、**项目无关**的 SEO 实践规范，用于指导新项目从零搭建一个面向自然搜索的内容站。
> 它不包含任何具体业务数据，只讲"怎么做才对 SEO 有利"以及"为什么"。
> 拿到新项目时，把本文当 checklist + 代码模式参考；遇到本文给了具体取值/格式的地方，直接照用，别另立约定。

适用场景：以**自然搜索（organic search）**为主要增长渠道的内容站、攻略站、文档站、数据库站、工具站落地页。
技术栈以 **Next.js App Router** 为例给出代码，但原则适用于任何 SSG/SSR 框架。

---

## 0. 最高优先级规则（先读，永不违反）

1. **TDH 默认不改。** TDH = 一个页面的 SEO 核心五项：**Title / meta-Description / H1 / H2 / H3**。
   - **唯一放行标准是 Google 是否已收录该页**：已收录 → 不改（改动会破坏已积累的排名信号和搜索快照）；未收录 → 可自由重写、重新定位关键词（无排名可保护，优化收益最大、风险为零）；不确定 → **先问，不要擅自改**。
   - 判断收录状态：GSC「网址检查」或流量数据。
   - 注意：nav 改造、组件重构、内链、正文增删**任何时候都能做**，不受收录状态约束——只有 TDH 受约束。

2. **绝不在 SEO 元数据里放版本号/日期。** title、meta description、H1、OG tag、JSON-LD 里都不要出现 `v0.x.x` 这类版本字符串或具体日期——它们会让搜索快照显得过时、且会频繁失效导致需要改 TDH。版本/日期信息只放在正文的"meta line"或正文段落里。

3. **一个主题 = 一个永久 URL。** 发布后绝不改 slug。必须迁移时用 **301 重定向**，不要直接改路径。

4. **绝不编造事实。** 涉及数据、数字、机制的内容必须来自可验证来源。拿不到真实值就用明确标记的占位符（如 `[TBD]`），绝不填一个看起来合理的假数据——一次造假就摧毁站点可信度。

5. **一页一个主关键词。** 主关键词必须同时出现在：URL slug、`<title>`、H1、intro 第一句。次级长尾关键词散布在 H2/H3 和正文。

---

## 1. URL 与站点结构

**URL 规则（每条生成的链接/路由都遵守）：**
- **扁平结构**：`/guides/beginners-guide`，不要 `/guides/2026/05/beginners-guide`。
- **slug 用英文关键词**，匹配用户实际搜索词。
- **全小写、连字符分隔**：无下划线、无空格、无大写。
- **slug 里不放日期或数字 ID**（版本号 detail 页如 `0-9-2` 是例外）。
- **永久**：发布后不改；要移动就 301。
- **Hub 是真实页面**，不是空目录——每个 hub 都列出并链接其子页。

**典型信息架构（hub + detail 两层）：**
```
/                     首页（流量分发器）
/{section}/           section hub（列出所有子页）
  /{section}/{slug}   detail 页（一个主题一个 URL）
/sitemap.xml /robots.txt
```
保持层级浅（≤2 层）。每个 section 都有一个真实可索引的 hub 页，即使内容还没填满，也用诚实的 "coming soon" 状态先让 Google 索引结构。

---

## 2. 页面元数据（每页 `<head>` 必备）

这些不可见，却决定约一半的 SEO 效果。

| 字段 | 规则 |
|---|---|
| `<title>` | 与 H1 不同；为最大化搜索结果点击率而写。约 50–60 字符。格式：`{页面主题} - {站点名}`。**不放版本号。** |
| `<meta name="description">` | Google 标题下的摘要。约 150–160 字符，含主关键词，为驱动点击而写。**不放版本号。** |
| Canonical | `<link rel="canonical">` 指向页面自身规范 URL。按 locale 规范化（见 §5）。 |
| Open Graph | og:title / og:description / og:image / og:url / og:type / og:site_name。 |
| Twitter Card | `summary_large_image` + title / description / image。 |
| robots meta | index/follow 控制；未完成或低价值页用 `noindex`。 |

**实现模式：一个 URL 真相源 + 一个页面级 builder。** URL 约定（默认语言无前缀、其余带前缀）只在 `shared/lib/seo.ts` 编码一次，canonical / hreflang / og:url 全部从它派生，因此不可能互相漂移：

```ts
// shared/lib/seo.ts
export function localizedUrl(path: string, locale: string): string;
export function hreflangAlternates(path: string): Record<string, string> | undefined;
export async function siteMetadata(locale: string): Promise<Metadata>;
```

- `localizedUrl` —— 唯一拼绝对 URL 的地方。
- `hreflangAlternates` —— 每个已发布语言一条 + `x-default`；单语言站返回 `undefined`（自指的 alternate 对爬虫没有信息量）。
- `siteMetadata` —— `[locale]` 段的站级默认值（关键词 + 卡片形状），由 `[locale]/layout.tsx` 应用。

页面级元数据用 `buildPageMetadata`（`components/site/PageFrame.tsx`），它调用上面两个 helper，统一拼 `{topic} - {gameFullName}` 标题、canonical 与 OG/Twitter 卡片。关键词页改用 `titleAbsolute` 逐字前置搜索短语（见 §2.1）。

### 2.1 关键词前置标题（titleAbsolute）

默认标题格式 `{topic} - {siteName}` 会自动追加品牌后缀。但**关键词页**（codes、boss/item 目录、mission 等用户带着精确搜索短语来的页）有一种更强的写法：**让 `<title>` 逐字前置完整搜索短语**，而不是把它压在 topic 之后、品牌之前。

- **何时用**：当你的**品牌名 / og:site_name 本身不包含目标关键词短语**时。常见于品牌是无空格 handle（如 `FooBarHub`）——它不携带 "foo bar" 这个被搜的短语，若用默认后缀格式，关键词会被埋在中间。
- **怎么做**：给 `buildPageMetadata` 传 `titleAbsolute`（逐字 title，不追加品牌）而非 `titleTopic`，二选一。让 title 与 H1 一致、都前置该页的精确搜索短语。
- **取舍**：`titleAbsolute` 放弃品牌曝光换关键词前置。**只在关键词页用**；首页、hub、about 这类靠品牌/导航的页仍用 `titleTopic`。
- 仍守 §0：title 一旦被 Google 收录就不再改。

```ts
// 关键词页：title = H1 = 用户搜的短语，逐字前置
buildPageMetadata({ titleAbsolute: '<Game> Laundry Code', description, path, locale });
// 普通页：topic + 自动品牌后缀
buildPageMetadata({ titleTopic: 'All Codes', description, path, locale });
```

---

## 3. 结构化数据（JSON-LD）

每页注入恰当的 schema，让 Google 拿到 rich result。用 `<script type="application/ld+json">` + `dangerouslySetInnerHTML`。

| Schema | 用在哪 | 怎么做 |
|---|---|---|
| `Article` | 每篇文章/攻略页 | headline / description / datePublished / dateModified / author(Organization) |
| `BreadcrumbList` | 每个非首页 | 组件自动注入，position 从 1 递增 |
| `FAQPage` | 含 FAQ 区块的页 | FAQ 组件自动从 Q&A 数据生成 |
| `ItemList` | 列表/网格 hub 页 | numberOfItems + itemListElement(ListItem) |
| `WebSite` | 首页 | name / url / description（可加 SearchAction） |

**关键模式：让组件自带 schema。** 面包屑组件、FAQ 手风琴组件内部各自注入对应 JSON-LD，作者只要用组件、不用手写 schema，杜绝遗漏：

```tsx
export function BreadcrumbJsonLd({ items, site }) {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.label, item: `${site}${it.href}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
```

发布后用 [Google Rich Results Test](https://search.google.com/test/rich-results) 验证。

---

## 4. Sitemap 与 robots.txt

**Sitemap（`app/sitemap.ts`）：**
- 列出所有应被索引的页；每条带 `lastModified` / `changeFrequency` / `priority`。
- detail 页的 `lastModified` 来自数据源（如 `item.updatedAt`），不要手填。
- hub 页用一个集中维护的 `SITE_LAST_UPDATED` 常量，取它与最新 detail 日期的较大值。
- **有意排除低价值/高churn页面**（如每日变动且几乎无搜索流量的明细页、设置页、API）——别把抓取预算浪费在它们上。
- URL 用规范生产 origin，不要受 `NEXT_PUBLIC_APP_URL` 这类环境变量影响。

**robots.txt（`app/robots.ts`）：**
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/*?'] },
    sitemap: `${site}/sitemap.xml`,
  };
}
```
攻略站的每个路由都是静态可索引内容页，没有后台/功能页需要屏蔽，所以 disallow 只留一条：拦查询参数 URL。加了站内搜索或 URL 承载的目录筛选后，它们会产出已被独立索引页面的近重复版本——这条规则就是为那种情况预留的。

**注意别顺手 disallow 法务页**：它们靠页面级 `noindex` 退出索引，在 robots.txt 里屏蔽反而让爬虫永远读不到那个信号。origin 用规范生产域名，不要受 `NEXT_PUBLIC_APP_URL` 影响，否则 preview 部署会发布一份指向自己的 robots.txt。上线后到 GSC 手动提交一次 sitemap。

---

## 5. 国际化（i18n）+ canonical + hreflang

- **locale 前缀用 `as-needed`**：默认语言（如 en）无前缀，其他语言加 `/{locale}` 前缀。关掉自动语言探测（`localeDetection: false`），避免 redirect 干扰抓取。
- **Canonical 按 locale 规范化**：默认语言 `{origin}{path}`，其他语言 `{origin}/{locale}{path}`；统一去掉非默认 locale 的 trailing slash。
- **多语言站必须加 hreflang**（单语言站可省）。在 metadata 的 `alternates.languages` 里列出每个语言版本 + `x-default`：
  ```ts
  alternates: {
    canonical: canonicalUrl,
    languages: { 'en': `${origin}${path}`, 'de': `${origin}/de${path}`, 'x-default': `${origin}${path}` },
  }
  ```
  ⚠️ 这是单语言站最常见的"将来扩多语言时忘了补"的坑——加语言时务必同步补 hreflang。
- **缓存头在中间件统一设置**，并删掉 `Set-Cookie` 让 CDN 可缓存：
  ```ts
  const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=14400';
  res.headers.set('Cache-Control', cacheControl);
  res.headers.set('CDN-Cache-Control', cacheControl);
  res.headers.delete('Set-Cookie');
  ```

---

## 6. 内链（站内链接）

内链决定 Google 如何理解站点权重、以及访客如何流动。每页都应用：

- **每篇文章链向两个核心 hub**：最入门的那篇 + 最新的"动态/更新"页。这两个是站点中枢。
- **Hub → 子页 → Hub 闭环**：每个 hub 列出子页，每个子页链回 hub。
- **正文上下文内链**：正文提到某个有独立页面的实体/概念时，就地 inline 链接过去。
- **底部 "Related" 区块**：每篇文章末尾 3–5 条相关内链。
- **面包屑**：每个非首页都有，可见 + schema 双份。
- **首页是流量分发器**，不是内容页——每个区块都向下分发。结构按当前价值排序（成熟内容靠前，未完成 section 放后面带 "coming soon"）。

**常见缺陷自查：**
- ❌ 有 `href="#"` 占位链接（要么实现要么删掉，别留死链）。
- ❌ 子页底部没有"浏览本 section 其他页"的区块。
- ❌ 内链全靠导航栏，正文里几乎没有上下文链接。

---

## 7. 单篇文章的页面结构（固定 block 顺序）

同一页型 = 完全相同的结构。利于 SEO、生成一致、用户熟悉。文章页按此顺序：

1. 站点 header + nav
2. **面包屑**（可见 + BreadcrumbList schema）
3. **H1**（一页一个，含主关键词）
4. **Meta line**：更新日期 + 版本戳 + 阅读时长（版本/日期只放这里，不进 TDH）
5. **Intro**：2–3 句，立刻回答搜索意图，含主关键词
6. **目录 TOC**：长页加跳转锚点
7. **正文**：H2/H3 分层，每个 H2 = 用户搜的一个子问题；短段落、可扫读的 bullet、带 alt 的截图、上下文内链
8. **FAQ 区块**：Q&A 格式 + FAQPage schema
9. **Related**：3–5 条内链
10. **Footer**：全站链接 + 官方外链

语义化 HTML：正确的标题层级（一个 H1 → H2/H3），用 `<article>` `<nav>` `<main>` `<footer>`。

---

## 8. 性能 / Core Web Vitals

Core Web Vitals 直接影响排名。优先做静态、轻量的构建。

- **字体**：用 `next/font` 并设 `display: 'swap'` 避免 FOIT（不可见文字闪烁）；按需 subset。
- **图片**：用框架的 `<Image>` 优化（自动 srcset/多尺寸/多质量/lazy）；首屏关键图加 `priority`，其余 lazy；**每张图都有 alt 文本**（无障碍 + 图片 SEO）。
- **缓存**：静态资源 `max-age=31536000, immutable`（1 年）；页面用 ISR（如 `revalidate = 3600`）+ CDN `s-maxage` + `stale-while-revalidate`。
- **静态生成**：能 SSG/`generateStaticParams` 的页就静态化，detail 页预渲染。
- 上线后用 Lighthouse / PageSpeed Insights 核 LCP / CLS / INP。

---

## 9. 收录加速（IndexNow + GSC）

新内容发布后主动通知搜索引擎，比干等抓取快得多：

- **IndexNow**：在站点根放一个 key 文件，发布/更新时 POST URL 给 IndexNow API（Bing / Yandex / Naver / Seznam 共享）。可做成发布钩子或 deploy hook 自动触发。
- **Google Search Console**：手动提交一次 sitemap；用「网址检查」请求收录重点新页、确认收录状态（这也是判断能否改 TDH 的依据，见 §0）。
- 提交前先确保页面真的可索引（非 noindex、canonical 自指、在 sitemap 里）。

---

## 10. 上线 SEO 验收 Checklist

新站/新页上线前逐项核对：

- [ ] 每页 title 唯一、约 50–60 字符、含主关键词、`{topic} - {site}` 格式、**无版本号**（关键词页可改用 `titleAbsolute` 前置短语，见 §2.1）
- [ ] 关键词成簇时按 §11 决策单页 vs Hub-and-Spoke；同义词合并、异意图词剔除
- [ ] 每页 meta description 唯一、约 150–160 字符、含主关键词、**无版本号**
- [ ] canonical 自指且按 locale 规范化；多语言站有 hreflang + x-default
- [ ] OG + Twitter Card 齐全，og:image 可访问
- [ ] 文章页有 Article schema；列表页 ItemList；FAQ 有 FAQPage；每个非首页有 BreadcrumbList
- [ ] JSON-LD 过 Rich Results Test
- [ ] sitemap.xml 自动生成、含所有索引页、lastModified 来自数据源；robots.txt 指向它
- [ ] 低价值/功能页已 noindex 或 disallow
- [ ] 一页一 H1、标题层级正确、语义化标签
- [ ] 主关键词进了 slug + title + H1 + intro 首句
- [ ] 内链：文章链向核心 hub + 底部 Related + 面包屑；无 `href="#"` 死链
- [ ] 图片有 alt、首屏图 priority、其余 lazy
- [ ] 字体 display:swap；页面 ISR；静态资源长缓存
- [ ] Lighthouse 移动端 LCP/CLS/INP 达标
- [ ] GSC 提交 sitemap；重点页请求收录
- [ ] slug 永久，迁移走 301

---

## 11. 关键词簇 → Hub-and-Spoke 内容架构

有时一个词不是单点，而是一**簇**：一个伞形词下面挂着一批更具体的长尾。架构判断错了，捕获效率差很多。这一节讲怎么从关键词数据反推页面结构。

### 11.1 识别"这是一个簇"
信号（任一即可）：
- GSC / 关键词工具里，主词的**扩展词成片出现且在涨**（`X code` 下面 `X laundry code` / `X office code` / `X armory code` 全在 surge）。
- SERP 第一页被 "All / List of …" 聚合页垄断 → 存在伞形词，且其下有可拆的具体项。
- 同一意图能枚举出 N 个具体实例（每个保险箱 / 每个 boss / 每件武器）。

### 11.2 单页 vs 开簇（Hub-and-Spoke）
- **单聚合页**：实例少（≤5）、各自搜索量都低、且高度同质 → 一页列全即可，省维护。
- **Hub + Spoke**：实例多、且**部分实例自带独立搜索量**（有人专搜 `X armory code`）→ 开簇：
  - **Hub** 吃伞形词（`X codes` / `all X codes`），一张表列全 + 从数据数组自动生成 `FAQPage` schema。
  - **Spoke** 每页死磕一个高量实例，正文深挖（位置 / 推导 / 奖励），用 `titleAbsolute` 前置该实例关键词（见 §2.1）。
  - 内链：Hub ↔ Spoke 闭环，Spoke 之间互链兄弟（见 §6）。
- 为什么开簇更强：伞形词竞争最激烈（被大站垄断），而 `X cabinet code` 这类细分词竞争薄，spoke 能单独排名；整簇内链又把权重在内部传导。

### 11.3 同义词合并：一页吃多个词
多个搜索词指向**同一个实例**时，合成一页、别拆。例：`webb code` / `perch safe code` / `penthouse safe code` 都是同一个保险箱 → 一个 spoke 在 H1 / intro / FAQ 里同时覆盖三种叫法，而不是开三页互相稀释。

### 11.4 剔除异意图 / 衰退词
同一词根下，**意图不同的词不要并进这一簇**。例：`X steam code`（激活/兑换码意图）、`X nvidia`（显卡捆绑意图）与 `X safe code`（游戏内密码意图）词形相近但意图迥异——混进同一页会让主题发散、伤相关性。判据：看 SERP 返回的是不是同一类页面。**在涨的、同意图的**才纳入；在跌的或异意图的排除。

### 11.5 落地数据模式（可复用脚手架）
用一个扁平数组做单一数据源，`slug?` 决定该条是否升级成 spoke 页——这是区别于 guides（每条都是一页）的第三种 section 形态：**一个 hub 聚合一张表，少数条目提升为深挖页**。

```ts
type CatalogEntry = {
  id: string; name: string; value: string;   // 实例本体（进 hub 表格）
  hint: string;                                // hub 表格里的"怎么拿"一列
  slug?: string;                               // 有 slug = 有独立 spoke 页
  metaTitle?: string; description?: string;    // spoke 的 SEO（仅当有 slug）
};
export const getEntry = (slug: string) => catalog.find((c) => c.slug === slug);
export const spokes = catalog.filter((c) => c.slug);   // 进 sitemap 的那批
```
Hub 渲染整张 `catalog` 表 + 由它生成 `FAQPage`；`spokes` 喂给 sitemap；无 slug 的条目只在 hub 表里出现（被 hub 的锚点承接）。新增一个 spoke：补 `slug` + 建一个 page 即可。适用于 codes / bosses / weapons / items / achievements 等任何"目录里少数值得深挖"的场景。

---

## 附：跨项目复用的代码模式清单

把这些模式当脚手架，新项目直接搬：

1. **`shared/lib/seo.ts` 的 URL 真相源** —— `localizedUrl` / `hreflangAlternates` / `siteMetadata`，canonical、hreflang、og:url 全部单点派生，配 `buildPageMetadata` 做页面级组装。
2. **自带 schema 的 UI 组件** —— `BreadcrumbJsonLd`、`FaqAccordion`（注 FAQPage）、`RelatedGuides`，作者用组件即得 schema。
3. **`app/sitemap.ts` / `app/robots.ts`** —— hub 集中日期 + detail 数据源日期 + 有意排除清单。
4. **`middleware.ts` 缓存 + i18n** —— 统一 cache-control、删 Set-Cookie、`as-needed` 前缀。
5. **固定页型模板** —— 文章页 10-block 顺序作为组件骨架，保证结构一致。
6. **Hub-and-Spoke 目录脚手架** —— 扁平数组 + `slug?` 决定是否出独立页 + `getEntry()`/`spokes` 两个 helper + 从数组生成 `FAQPage`（见 §11.5）。区别于 guides（每条=一页）的第三种 section 形态。
7. **`titleAbsolute` 关键词前置标题** —— `buildPageMetadata` 二选一参数，关键词页逐字前置搜索短语、不追加品牌后缀（见 §2.1）。
