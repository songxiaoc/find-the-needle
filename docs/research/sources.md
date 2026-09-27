# Find the Needle 资料与素材核实

核实日期：2026-09-27。本站面向 Steam 游戏 **Find The Needle**，不是 Roblox 的同名或近似游戏。

## 一手来源

| 来源 | 地址 | 用途 |
| --- | --- | --- |
| 正式版 Steam 商店 | https://store.steampowered.com/app/5160800/ | 游戏身份、玩法、开发者、发行商、计划发售时间、官方功能列表 |
| Demo Steam 商店 | https://store.steampowered.com/app/5165210/ | 免费试玩入口、发布日期、平台和配置要求 |
| 正式版 appdetails | https://store.steampowered.com/api/appdetails?appids=5160800&l=english | 机器可读元数据与官方截图 URL；原始响应保存在 steam-5160800.json |
| Demo appdetails | https://store.steampowered.com/api/appdetails?appids=5165210&l=english | 原始响应保存在 steam-5165210.json |

原始响应的外层 key 与请求 appid 不完全一致；内容内 `steam_appid`、`name`、开发者、截图目录均对应目标游戏。本站身份同时对照实际商店 HTML，不使用外层 key 推断游戏身份。

## 已确认事实

- 开发者为 FindTheNeedleDev；发行商为 Hay Passionates。
- 正式版尚未发售，商店计划为 Q4 2026，没有具体日期。
- Demo 于 2026-09-10 发布，免费可安装。
- appdetails 标记 Windows 为 true，macOS 与 Linux 为 false。
- 官方 Features / categories 标记 Single-player。用户标签中的 Multiplayer 不代表官方内置联机。
- 商店描述从手动挖掘、出售干草过渡到传送带、供电、打包机、扫描器和机械臂。
- 商店列出手动工具（铲、桶、手推车、叉、吸尘设备）、干草加工产品和科技树。站点不声称正式版所有内容在试玩中均可解锁。
- 商店列出英语、法语、德语、西班牙语（西班牙）和俄语，本站按用户要求覆盖这五种语言。
- 配置要求见 demo 指南；原始描述明确指出核显不支持且可能崩溃，大型工厂对 CPU 的负载更高。

## 内容范围

现有六个攻略主题，每篇英语、法语、德语、西班牙语、俄语完整对应。深入资料与官方回复见 [Demo研究记录](./demo-evidence-2026-09-27.md)：

1. `/guides/guide/getting-started`：手动收集、容器UI、研究树及购买思路。
2. `/guides/guide/automation`：V8售卖口吸附、F自由放置、电线杆E关闭电网、低电提示、扫描器分流检查。
3. `/guides/guide/demo`：下载、配置、官方存档目录与备份、试玩范围及继承边界。
4. `/guides/guide/machines-and-products`：工具/机器用途与草产品、输入输出采购检查。
5. `/guides/guide/needles-and-scanners`：开发者解释Silo中的针、售出回草堆、明确归属的社区排查、5/6未解决报告。
6. `/guides/guide/demo-updates`：V8历史改动与有日期的官方动态，不能据此推定当前build。

不收录未经核实的按键、针的位置、机器配方/产能/当前价格、流程计时、针总数、试玩上限、结局、跨平台兼容结论。F/E与存档路径已有官方依据；80%价格变化仅按V8历史公告表述。网络搜索出现多个将 Roblox 内容混为 Steam 的站点，均未用作事实来源。没有将第三方联机模组等同于官方联机。

## 素材

用户已明确说明素材有授权。本次仅使用 Steam 商店公开的官方图片；没有使用其他攻略站的图片或正文。

- 原始下载 URL 及文件名见 `assets.json`。
- 本地素材目录：`public/images/find-the-needle/`。
- `header.webp`：Steam 头图，用于封面。
- `screenshot-0.webp`：仓库与草堆俯瞰图，适合入门页。
- `screenshot-1.webp`：传送带通往 SELL HAY 售卖口，适合自动化与首页场景。
- `screenshot-2.webp`：多分支工厂全景，用于机器布局及寻针线路检查。
- `screenshot-4.webp`：草叉与桶容量UI，用于入门和工具用途；画面数值不泛化成所有桶的容量。
- `screenshot-5.webp`：研究树，展示Hay Lines/Power/Processing分支，不当作Demo全部解锁证明。
- `screenshot-3.webp` 和 `screenshot-6.webp`：保留，未为增加图片数量而插入。
- WebP 仅作尺寸/格式压缩，最长宽度 1600，质量 85；不改变游戏画面信息。

图片权利归游戏权利方；站点为独立非官方网站，不暗示开发者或发行商背书。

## 获取与复核

本机直接与代理访问 Steam API 超时后，使用已授权 Linux 主机只读 curl 下载，并 scp 回本地。网页读取工具也独立核对了主游戏和 demo 两个官方商店页面。没有读取或输出游戏账号、Steam cookie 或任何 API 密钥。
