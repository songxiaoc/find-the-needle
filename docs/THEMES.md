# 主题（Themes）

模板内置一个**视觉主题预置库**。每个站点在**构建期**选一个——
**不是**运行期开关，因为 Tailwind 的 `@theme` 在构建期生成颜色工具类，没法靠 env var 或
`data-` 属性切换。

两条轴相互独立：

- **Accent**（你游戏的品牌色）→ `src/components/site/brand.css` 的 `--brand-*` 旋钮。改一处即可
  给全站（首页 + wiki/docs）重新上 accent，**任何**主题都适用。
- **Theme**（表面 / 字体 / 氛围）→ 下面的预置。
- **UI Recipe**（archetype / Hero / density / shape / motion 等受控选择）→ `src/generated/ui-recipe.json`。按 `src/config/ui.ts` 里的枚举编辑；Theme 仍是构建期选择。

## 预置

| 主题 | 氛围 | 明/暗 | 适合 |
|-------|------|-----------|---------|
| **tactical**（默认） | 冷蓝黑、等宽数据标签、方正。安静、信息密集。 | 暗 | 大多数游戏——开箱即用的样子。 |
| **pixel** | 暖炭棕面板、斜角 + 硬阴影、复古游戏 HUD。 | 暗 | 像素 / 复古 / 治愈系小游戏站。 |
| **neon** | 近黑蓝紫、电光青/品红 accent、可选辉光。 | 暗 | 赛博 / 合成波 / 街机 / 射击。 |
| **aurora** | 干净的近白表面、石板灰文字、通透。 | 亮 | 精致、偏文档感、受众面广。 |
| **sakura** | 暖米纸色、棕李色文字、玫瑰 accent、圆润。 | 亮 | 治愈 / 休闲 / 生活模拟攻略。 |

每个主题的 CSS 变量**名**都完全一致（`--site-primary`、`--site-surface`…），而 `--site-primary`
永远从 `--brand-*` 旋钮派生——所以换主题从不动组件，你的 accent 也跟着跨主题保留。

---

## 选主题

选择源**正好两个**。把两个都指向主题文件夹：

1. `src/config/style/active-theme.css` —— CSS 调色板 + utils：
   ```css
   @import '../../components/site/themes/neon/tokens.css';
   @import '../../components/site/themes/neon/utils.css';
   ```
2. `src/components/site/active-fonts.ts` —— 字体：
   ```ts
   export { fontVars, fontDisplay, fontBody, fontMono } from './themes/neon/fonts';
   ```

别的都不用动（圆角、方边、字体全在主题包里）。切完重启 `pnpm dev`（新的 `next/font` 导入
需要重启服务器）。

---

## 加一个新主题

一个主题就是 `src/components/site/themes/<name>/` 下一个自包含文件夹，含三个文件：

- `tokens.css` —— 调色板。复制 `themes/tactical/tokens.css`，保留每个 CSS 变量**名**，只改
  hex 值、`--radius`、`color-scheme`、以及 `@theme` 里的 font-family 行。**规则：**
  - 保留 `--site-primary: var(--brand-primary);`（派生——绝不硬编码 accent），`-dim`/`-container`/
    `-on-primary*` 同理。
  - **不要**把 `--color-site-primary*` 放进 `@theme` 块——它们来自 `brand.css`，这样 accent 才
    认每个游戏的旋钮。
  - 亮色主题设 `color-scheme: light;`，并确保 surface 阶梯仍清晰可分（卡片必须能从页面背景里分出来）
    ——见 `docs/PITFALLS.md`。
- `utils.css` —— 可选的效果类（如像素斜角、霓虹辉光）。主题不需要的话，留个占位注释即可。
- `fonts.ts` —— `next/font/google` 字体族，导出 `fontDisplay`、`fontBody`、`fontMono`、以及
  `fontVars`（合并后的 `.variable` 字符串）。照搬 `themes/tactical/fonts.ts`。

之后就能通过上面那两个选择源来选它了。

---

## 自适应 UI 合同

`src/generated/ui-recipe.json` 是受控视觉方向的合同。运行时根节点会带：

```text
data-ui-archetype
data-ui-theme
data-ui-navigation
data-ui-guide-card
data-ui-category-card
data-ui-article-layout
data-ui-density
data-ui-shape
data-ui-motion
```

这些属性是组件变体的稳定接口，不是运行期主题切换器。`DESIGN.md` 和 `design-tokens.css` 可以覆盖品牌色、形状、节奏与动效基线；字体和 Tailwind palette 仍由选中的 build-time theme 提供。
