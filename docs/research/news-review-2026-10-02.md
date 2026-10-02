# 2026-10-02 游戏资讯复核

## 对象与结论

仅核对 FindTheNeedleDev / Hay Passionates 的 Find The Needle（Steam 5160800）及 Demo（5165210）。排除 Roblox、NoGlyph、Studio Bitdot 等同名或相似作品。未进行实际游玩。

未找到 2026-09-27 后的新公开玩法补丁或明确发售日，不新增新闻页。完善现有 Demo 与 Demo updates 的英、法、德、西、俄五语版本；保留 title、description、所有 H1–H6、首次发布日期与图片。

## 官方核对

- [主游戏 Steam 商店](https://store.steampowered.com/app/5160800/Find_The_Needle/)仍为 Q4 2026，没有确切日期，未正式发售。
- [Demo Steam 商店](https://store.steampowered.com/app/5165210/Find_The_Needle_Demo/)仍提供免费 Demo，单人模式，Windows。表格列出 12 种语言，并对所有语言标注界面、完整音频、字幕：英语、波兰语、法语、西班牙语（西班牙）、捷克语、简体中文、德语、俄语、日语、韩语、土耳其语、葡萄牙语（巴西）。公开文案表述为商店列示，未宣称本站验证翻译或配音质量。
- [主游戏 News API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=5160800&count=100&maxlength=0)实时返回 5 条公告：9/11 Demo V8，9/15 Top 10，9/20 Top 5，9/23 Top 3，9/25 第 1。最新仍是热度公告。
- [Demo News API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=5165210&count=100&maxlength=0)实时没有新闻条目。此结果不能排除未公开的构建变化，不能称 V8 是今日安装版本。

## 媒体与数据库

- [PC Gamer 9/28 周报](https://www.pcgamer.com/gaming-industry/steam-week-in-review-great-haystack-slop-is-a-thing-now/)仅在同类游戏列表提到本作并链接 app 5160800；Q4 2026 与官方一致，没有新机制。其主体讨论 Studio Bitdot 的另一款游戏，不移植其玩法、合作模式或玩家数据。
- [PC Games 9/25 报道](https://www.pcgames.de/Spiele-Thema-239104/News/Find-the-Needle-Automatisierung-Demo-Spielerzahl-1554903/)讨论 Demo 热度与已有自动化玩法，没有新补丁。
- [SteamDB Demo 图表](https://steamdb.info/app/5165210/charts/)在本次检查中列出 9/27 历史峰值 21,203 同时在线。向旧 updates 时间线补充这一条，明确为历史数据，不称今天在线人数或排名。
- SteamDB 的 10/1 Last Record Update 是数据库记录时间，动态 Builds 列表未加载，不据此宣称新补丁。
- GamesRadar、GamingOnLinux、Destructoid 等定向搜索未找到本作新增报道。RPS、IGN、GameSpot、PCGamesN、Eurogamer 部分页面受到 robots 限制。结论仅是本次没有发现，不保证所有平台没有报道。

## 修改边界与验收

- Demo updates：补充截至 10/2 的公开公告状态、仍 Q4 的发售窗口、9/27 历史在线峰值。
- Demo：补全 12 种语言；保留旧存档与机制资料的原核实日期，不把本次商店复核包装成全部攻略重新实测。
- 共 10 个既有 URL，未新增路由、不改首页、配置或页面布局。
- 部署前后逐页对比线上 title、description、全部正文标题；检查正文新内容、canonical、索引规则、站点地图 lastmod。
- 使用既有 main 分支 GitHub Actions 流水线，Node 24 构建并部署 Cloudflare；代码同步推送。未提交 IndexNow。
