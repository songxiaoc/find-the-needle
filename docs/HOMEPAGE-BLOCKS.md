# 首页积木（Homepage blocks）

> 首页是**可组合的**：一个有序的配置 block 数组，而不是固定版式。页面里**没有任何硬编码的
> section 文案或结构**——每个 section 都是一个 block，文案全在配置里。这与主题系统是同一个
> 「config-driven、绝不硬编码」方向（见 [`THEMES.md`](./THEMES.md)）。

## 为什么有这套东西

首页过去是写死在 `src/app/[locale]/page.tsx` 里的固定序列：硬编码的 `<h1>`（`{game} guides & reference`）、
硬编码的 CTA（`Browse the guides` / `About this site`）、以及四个固定 section（Start / Latest / FAQ / About）。
一套完整首页需要的是 hero、一组「Start here」、若干内容模块（code-cards / step-by-step / tier-grid / card-list）、
一个「What is \<game\>?」块、以及收尾 CTA——但几乎全都渲染不出来，因为模板没有对应的槽位。
配置里写了，却没有任何组件去读，就是「死配置」。

修法：把首页做成一个 **block 列表**。任何你想出现在首页的内容都映射到模板能渲染的 block。
如果模板渲染不了某个形状，就**给模板加一种 block**——绝不静默丢掉配置内容。

从 Adaptive UI Recipe v2 起，内容 Block 与组件组合分离：Block 提供稳定 `id` 和内容，`src/generated/ui-recipe.json` 的 `homepage.blocks[id]` 选择受控 Section / Layout / Card Variant。模板只渲染注册表中的组合，并对缺失 Recipe 使用原有安全布局。详见 `src/config/ui.ts` 的 `homeBlockRecipe()`。

## 怎么工作

- **配置** —— `src/config/homepage.ts` 导出 `HOME_BLOCKS: HomeBlock[]`，一个有序数组。每项是
  `{ type, ...props }`。可自由重排 / 增 / 删 block，页面随之变化。
- **渲染器** —— `src/components/site/HomeBlocks.tsx`（`<HomeBlocks>`）把每个 block 分发到对应组件。
  所有文案都来自 props；渲染器和页面里**没有任何**面向用户的硬编码文案。
- **页面** —— `src/app/[locale]/page.tsx` 装配运行期 `ctx`（locale、guides、categories），渲染
  `<HomeBlocks blocks={HOME_BLOCKS} ctx={ctx} />`。页面里**不再有任何 section 标记**。
- **标题** —— 首页 `<title>` / description 来自本地化的 `common.metadata` 块，
  **不是** `gameConfig.siteName`。hero 下方的**事实 chips**
  （状态 / 版本 / facts）仍来自 `gameConfig`（`statusBadge` / `gameVersion` / `heroFacts`）。

## Block 类型

| `type` | 渲染成 |
|--------|---------|
| `hero` | `<h1>` 区：eyebrow + title + description + CTA（第一个=主按钮）。版式由 `gameConfig.heroStyle` 决定。 |
| `start-cards` | 手工挑选的「Start here」卡片行（`DragScrollRow`）。 |
| `code-cards` | 兑换码卡片（`code` + `reward` + 状态徽章）。 |
| `tier-grid` | 等级行（S/A/B… + label + detail）。 |
| `step-by-step` | 编号步骤。 |
| `card-list` | 带标签的事实卡片（label + detail）。 |
| `about` | 「What is \<game\>?」：段落 + 一张数据表 + 一个 CTA。 |
| `final-cta` | 收尾 CTA 横幅（title + description + CTA）。 |
| `latest-guides` | 最近更新的 N 篇 guide（运行期数据）。 |
| `category-grid` | 每个 guide 分类一张卡（数量取自 registry）。 |
| `faq` | Q&A 手风琴（同时输出 FAQ JSON-LD）。 |

内容类 block（`code-cards` / `tier-grid` / `step-by-step` / `card-list`）可带一个可选 `href` →
渲染成一个「View all →」链接指向对应 guide 页。**每个 `href` 必须能解析到真实路由**，
否则 `pnpm validate:site` 会失败。

## 新增一种 block 类型

1. 在 `src/config/homepage.ts` 的 `HomeBlock` 联合类型里加一个变体。
2. 在 `src/components/site/HomeBlocks.tsx` 加一个渲染函数 + `BlockSwitch` 里的一个 `case`。
   所有文案放 props——**不写任何字面量**。
3. 若是带编号的 section（`§NN` 头），把该 `type` 加进 `sectionNumberedTypes`。
4. 若需要运行期数据，扩展 `HomeCtx` 并从 `page.tsx` 传入。

## 校验

`pnpm validate:site` 会核对 homepage 配置与模板契约：block 类型合法、id 不重复、
多语言结构与默认语言一致、href 指向真实路由。授权文案是否真的出现在渲染后的 HTML 里，
要靠你自己打开页面看——模板不会静默丢掉配置，但也不会替你读一遍 DOM。

## 关联

- [`THEMES.md`](./THEMES.md) —— 另一条「config-driven、构建期决定」的轴。
