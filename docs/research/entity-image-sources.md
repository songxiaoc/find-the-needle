# 实体图片来源与映射

核实日期：2026-10-05。来源为 [官方主游戏 Steam 页面](https://store.steampowered.com/app/5160800/Find_The_Needle/)、[官方 Demo 页面](https://store.steampowered.com/app/5165210/Find_The_Needle_Demo/) 及其 appdetails API。逐张查看了本地素材，图片仅转换/压缩为 WebP；视频帧用现有 ffmpeg 在指定时间提取，无生成、重绘或改变画面。卡片的聚焦仅使用 CSS，详情保留完整画面。

## 新增并发布的素材

| 本地图片（public/images/find-the-needle/） | 官方来源 | 对应实体与画面事实 |
| --- | --- | --- |
| official-demo-yard.webp | [Demo 独有截图](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5165210/d43ffdaba7f0e632b8749c0fe6ed6cc7221cc3ca/ss_d43ffdaba7f0e632b8749c0fe6ed6cc7221cc3ca.1920x1080.jpg?t=1791115394) | conveyor-belt：草团沿传送带运往 SELL HAY。未把草团认定为 hay-wad；未将前景无标签工具认定为 Vacuum Yard。1918×1080。 |
| official-research.webp | [Tech tree 视频封面](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5160800/extras/c485d9f6f6d4e1efbee3c8f5f739dbca.poster.avif?t=1791115357) | needle-scanner 和 metal-detector：研究界面清楚显示 Scanner Mk I Plans、Metal Detector 节点。图说明确是研究菜单，未当作设备外观。1170×658。 |
| official-automation.webp | [Start Automating 视频封面](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5160800/extras/79a0fc0630a9de4434e5e0fe885b46d6.poster.avif?t=1791115357) | pellet-disc-machine：右上可见 Pellet Discs Plans，中央为 Small Arm Plans。图说明确是研究菜单。1170×658。 |
| official-hay-bales.webp | [Hay products 官方视频](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5160800/extras/9a119acef419918753a12be4667624b3.mp4?t=1791115357)，10.5 秒 | hay-products：两块有绑带的矩形草捆在分支传送带上，旁边为无名称标签的绿色加工设备。未给绿色设备赋予 Silo、Scanner、Pellet Disc Machine 等名称，未宣称所有产品均已在 Demo 解锁。1170×658。 |

## 保留的现有映射

- hay-sell-stand → screenshot-1.webp：可辨认 SELL HAY 文字和交货端。
- robotic-arm → screenshot-2.webp：草堆四周的橙色机械臂。
- power-pole → screenshot-5.webp：研究树的 Power Pole 命名节点，图说保持研究界面的属性。
- pitchfork → screenshot-3.webp：第一人称手持叉子。

每种语言均有 9/15 条实体记录带图。新增五条实体对应的 alt、caption 五语同步；其余六条未找到能确定对应的设备/产品图，因此保持无图。研究节点卡片焦点为 Scanner 40% 31%、Metal Detector 40% 37%、Pellet Discs 94% 26%，放大 3 倍；不是修改源图片。

## 已核实但未发布的素材

- The pile 封面 `7b800485858217234bfc33a08fdbe542.poster.avif`：仅草堆近景，未见具体设备。
- The tools 封面 `83035f4d9c6ddc9d2dcae0e28785152b.poster.avif`：地面叉子与桶；现有叉子图已更清楚，因此未重复加入实体。
- Hay products 封面 `9a119acef419918753a12be4667624b3.poster.avif`：绿色放置轮廓，无法确定具体设备或产品，采用同章节视频的实际草捆画面。
- Hay products 视频其他样本帧中的分支输送结构缺少 U 型号标签，未认定为 U-Splitter/U-Joiner。
