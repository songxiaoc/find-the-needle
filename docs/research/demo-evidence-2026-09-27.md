# Find The Needle Demo 深入资料核实

核实日期：2026-09-27。对象仅为 Steam app 5160800 与 Demo 5165210。本文是中文内部取材记录，不是公开攻略。Steam 页面与 News API 由已授权远程主机只读 HTTP 访问，未登录 Steam、未使用私人讨论或 Discord 内容。没有实际游玩，玩家回帖不能包装为本站实测。

## 1. 官方 Demo V8 更新：可直接支持操作教程

- 官方公告直链：https://steamcommunity.com/games/5160800/announcements/detail/688642424435639126
- 同一公告的 Steam 商店新闻链接：https://store.steampowered.com/news/app/5160800/view/688642424435639125
- API：https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=5160800&count=50&maxlength=0
- API 时间戳 `1789164473` = **2026-09-11 22:07:53 UTC**，北京时间为 9 月 12 日。公开英文页统一可使用 September 11, 2026 并说明 UTC。
- 标题：Find The Needle Demo V8；作者 animatemesh；Steam 官方 Community Announcements。
- 截至核实时，此 API 返回五条主游戏公告，仅这一条有具体机制变动。不能据此说 Demo 目前仍运行 V8，也不能宣称后续没有未公开构建更新。Demo app 自身新闻 API 返回空数组。

以下为对全部条目的中文转述，保留机器/按键原名供编辑定位，不逐字转载：

1. Hay Sell Stand 的传送带现在支持吸附连接。
2. 玩家可决定传送带是否吸附；按 **F** 启用 **No Snap Mode**。
3. 对 power pole 按 **E** 可关闭整张电网。
4. Vacuum Yard 价格在此次更新中下调 80%；公告没给最新绝对价格。
5. 电力低于需求阈值时，会出现电网通知视觉效果。
6. 默认跳跃高度提高。
7. 传送带系统重做，吸附更容易，具有自动路径规划。
8. 新增 **U-Splitters** 和 **U-Joiners**。
9. 增加游戏提示，替换原来显示 Demo V8 的文字位置。
10. 地面散草转为草簇，以改善帧率。
11. **Pellet Disc Machine** 增加 **BRICKS**、**HAY** 等资源指示。
12. 另有多项未逐条列明的 bug 修复。

可落地内容：吸附与自由放置的区别、售草口接入、检查电网是否被 E 关闭、识别缺电提示、查看 Pellet Disc Machine 的资源提示。不要从上述条目推导机器配方、价格、产能或全部建造按键。

## 2. 针、Silo、草产品：官方回复与未解决问题分开

### 已证实：开发者解释针可藏在草产品里

链接：https://steamcommunity.com/app/5160800/discussions/0/563667940587640064/

主题 How to get the needle out of the Silo?，2026-09-13。作者说 Silo 中有三根针，不知如何取出。**FindTheNeedleDev 带 developer 标识**，9 月 13 日回复：

- Silo 不会销毁针，而会将针打包到 hay wad。
- hay wad 及其他草产品可能含针。
- 如果从 Silo 出来的产品沿生产线进入 Hay Sell Stand，针会随产品出售并回到草堆。

需要保留的边界：这是开发者对正常机制的描述，不是保证所有 Demo bug 都不会丢针。不要写成“5/6 永远只需等针回草堆”。

同帖玩家后续报告与建议：

- 玩家以 Piston Rake → conveyor → Silo → conveyor → Needle Scanner 布线，Silo 显示 **44 Loose Straw, 1 Needle Waiting**，但不再出料。
- 一位玩家称拆 Silo 收到了针被毁的警告；没有官方解释，**不建议指导用户拆除/清空作为保底修复**。
- 另一位玩家建议给 Silo 足够散草组成一份出料，针会随之输出；这是玩家建议，不能写为开发者确认的修复或引用固定装载数。

### 玩家提出：扫描器被绕过、机器臂跨线放料

链接：https://steamcommunity.com/app/5160800/discussions/0/567046289381054539/

主题 Needle just sold，2026-09-21。发帖者称草均经过扫描器，却有针被出售。回复者建议观察机器臂是否会在主带拥堵时把物料丢到可触及的其他传送带，检查这些支路是否也经过扫描器；另建议用分流/合流让所有路径经过扫描器。**没有开发者回复。** 可以作为明确标识的社区排查建议，不可宣称已找出所有丢针根因。

### 未解决：5/6、零草后最后一针缺失

- https://steamcommunity.com/app/5160800/discussions/0/587312703065119554/ ：9 月 25 日，玩家称玩 7 小时后 5/6 针、0 草，两个回复没有解答。
- https://steamcommunity.com/app/5160800/discussions/0/563667534781884502/ ：9 月 12 日，玩家称小草堆清空后只找到 5 根，清理并拆机器仍没找到最后一根；无官方回复。

因此可以写“玩家确实报告过这个状况；目前这些帖子没有开发者确认的通用修复”。不要编造针坐标、重启必恢复、焚烧必返还或让用户删档重开。

### 社区建议：扫描器吞吐瓶颈

链接：https://steamcommunity.com/app/5160800/discussions/0/567045939002396961/

主题 Need faster scanners to keep up with production，9 月 16 日。玩家建议将一条生产线分成两路、各设扫描器，再合流。可以标为社区布线思路；不能据此给出每秒扫描量、机器数量最优解或保证增产倍数。

## 3. 存档：开发者给出的具体路径

官方回复：https://steamcommunity.com/app/5160800/discussions/0/563667940587675789/

主题 wheres the save directory?，2026-09-13。**FindTheNeedleDev 带 developer 标识**回复路径：

```text
%APPDATA%\Godot\app_userdata\Haystack Incremental\saves
```

可提供 Windows `Win + R` 粘贴目录的方法，以及“关闭游戏后复制整个 saves 文件夹到另一个位置”的通用备份建议。建议应写为文件管理操作，不宣称已经验证所有平台、云存档、跨版本兼容或具体存档文件名。

独立玩家佐证：https://steamcommunity.com/app/5160800/discussions/0/587312703065132960/

9 月 25 日玩家为笔记本迁移到台式机找存档，指出父目录位于 `AppData\Roaming\Godot\app_userdata\Haystack Incremental`；另一位玩家感谢。更具体的 `saves` 应采用上述开发者回复。

### 未确认：Demo 存档可否继承正式版

https://steamcommunity.com/app/5160800/discussions/0/567045939002747624/

9 月 19 日玩家问 will my demo save game be in release version?；核实时 **0 回复**。商店页也没有提供继承承诺。因此写“尚无已核实的官方继承说明”，不要给否定或肯定结论。

## 4. 其他真实玩家需求（不是已证实解法）

- https://steamcommunity.com/app/5160800/discussions/0/587313051305292397/ ：conveyors for payment，9 月 26 日。玩家称多个传送带可通向售草计价点、建议使用网格吸附；没有开发者确认，不据此保证无限入口吞吐。
- https://steamcommunity.com/app/5160800/discussions/0/567046289380920650/ ：Moving equipment，9 月 20 日。玩家希望可移动机器，称拆后重建价格继续增加；没有官方说明，不能写免费移动、全额退款。
- https://steamcommunity.com/app/5160800/discussions/0/587312703065158395/ ：Power issues，9 月 25 日。玩家反映后期发电扩张昂贵；没有官方回复，不按该玩家价格建立通用数值表。
- https://steamcommunity.com/app/5160800/discussions/0/567045939002759684/ ：Played 12 Hours of the Demo，多位玩家讨论扫描器拥堵、多个扫描器与机器臂、Mountain 草堆和长时间未找到针。这些互相差异很大的进度只能证明问题存在，不能据此保证 Demo 时长、针出现概率或固定解锁顺序。

## 5. 新闻范围与更新写法

主游戏 News API 返回 5 条官方公告：

| UTC 日期 | 内容 | API 对应新闻入口 |
| --- | --- | --- |
| 2026-09-11 | Demo V8 具体更新 | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1843481262696545 |
| 2026-09-15 | 开发者宣布 Demo 进入最常玩 Top 10 | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1843481262705484 |
| 2026-09-20 | 开发者宣布 Top 5 | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844115010498471 |
| 2026-09-23 | 开发者宣布 Top 3，提到 Factorio 与 Satisfactory 的启发 | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498219204 |
| 2026-09-25 | 开发者宣布全球最常玩 Demo 第 1 | https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498225947 |

这些排名是开发者当时的公告，应写“开发者在某日宣布”，不能当作本日实时排名，也不能以“最新补丁”概括热度公告。比起围绕每个热度节点拆四篇短文，优先一篇版本与状态页，并把 V8 机制融入实际攻略。

## 6. 公开稿的证据边界

- 已证实且实用：F No Snap、E 电网、售草口吸附、缺电提示、资源指示、官方存档路径、针可能藏在草产品、售出的针回草堆机制。
- 社区经验：扫描器前分流后合流、检查机器臂跨线投放、Silo 补草出料；必须明确标识。
- 尚不支持：固定针坐标、针总数适用于所有模式、Demo 全解锁表、具体配方/功耗/价格/吞吐、Demo 继承正式版、5/6 bug 保证修复、机器拆除不会丢针。
- 游戏商店宣传的超过 300 项升级是完整游戏介绍，不等同于 Demo 已可解锁 300 项。
- 搜索与社区浏览仅使用目标 app；未引用任何 Roblox 同名站。
