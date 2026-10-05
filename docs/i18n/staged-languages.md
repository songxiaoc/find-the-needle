# 备用语言资源

本分支 `codex/all-official-locales` 保存官网全部 12 种语言的完整站点版本，供后续逐批选取资源。生产 `main` 仍只包含英语、法语、德语、西班牙语、俄语和简体中文，共 234 个页面 URL。

## 待发布语言

| 语言 | 资源代码 | URL 前缀 | hreflang | 每种语言页数 |
| --- | --- | --- | --- | ---: |
| 日语 | `ja` | `/ja` | `ja` | 39 |
| 韩语 | `ko` | `/ko` | `ko` | 39 |
| 波兰语 | `pl` | `/pl` | `pl` | 39 |
| 捷克语 | `cs` | `/cs` | `cs` | 39 |
| 土耳其语 | `tr` | `/tr` | `tr` | 39 |
| 葡萄牙语（巴西） | `pt` | `/pt` | `pt-BR` | 39 |

每种待发布语言包含 6 篇完整攻略、15 个数据库条目、5 个首页/工具/基础信息 JSON 包及一个 common 消息包。共用现有页面组件、素材与全部站内 slug，不新增独立的语言专用页面结构。

## 后续发布步骤

1. 从当前生产 `main` 建立本批发布分支，按需要选取一种或多种语言。
2. 从本备用分支取对应 `content/guides/guide/*.<locale>.mdx`、`content/entities/**/*.<locale>.json`、`src/generated/locale-packs/<locale>/` 和 `src/config/locale/messages/<locale>/`。不要复制其他待发布语言的资源，以免触发未启用语言校验。
3. 在 `src/generated/additional-locales.ts` 增加该语言 5 个 JSON 导入及对应映射，在 `src/config/locale/messages.ts` 导入 common 消息，在 `src/generated/site-locales.ts` 的生产清单增加该代码。保留现有生产语言和全部中文资源。
4. 按 `template-contract.json` 中 managedFiles 规则同步 `src/generated/site-manifest.json` 的语言和文件清单；模板合同未改时保留合同 SHA-256。
5. 检查当地措辞及机器术语、完整构建、目标语言 39 页、所有现有语言的 reciprocal hreflang、Sitemap 与 llms.txt，以及其余未发布语言的 404。
6. 合并本批修改进 `main` 后由 GitHub Actions 部署。不要直接合并整个备用分支；本分支的构建清单启用了所有 12 种语言，仅用于完整性检查。

`.github/workflows/deploy.yml` 的生产任务仅允许 `refs/heads/main`，备用分支推送和手动触发均不会运行生产部署。备用分支不绑定公开 Preview 域名。

## 已验证的中文生产发布

2026-10-05，提交 `c592851d7e45439b8efeb4ad7ad10e1985f94a42` 已通过生产流水线并发布。线上 39 个中文 URL 均为 200，中文 canonical、`zh-CN` hreflang、H1 与正文检查通过；Sitemap 为 234 个 URL，llms.txt 包含中文且不含待发布语言。6 种待发布语言的首页与试玩攻略均返回带 noindex 的 404。

本地浏览器已验证中文桌面/移动端布局、语言菜单、检查清单保存和计算器结果。线上原始 HTML 与 HTTP 状态已验证；线上浏览器访问受连接超时影响。其余语言完成了结构及事实保留检查，公开前仍应检查当地表达和术语。

备用分支完整构建已通过，Sitemap 生成 468 个 URL，12 种语言各 39 页；逐页检查 HTML lang、canonical、唯一 H1 和 13 个 hreflang（12 种语言加 x-default）均通过。该构建仅用于本地完整性验收，没有部署。
