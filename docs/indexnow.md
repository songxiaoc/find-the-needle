# IndexNow 配置与提交

站点已部署独立的 IndexNow 所有权文本文件。提交脚本根据 `src/generated/game-config.ts` 的域名配置工作，自动识别 `public` 内唯一的匹配 key 文件。

本脚本复用 Word Puzzle World 的显式 URL 提交方式：不传 URL 会退出，不会默认提交全站，也不会在普通部署后自动提交。

## 提交指定页面

```sh
pnpm indexnow:submit --dry-run https://findtheneedle.site/
pnpm indexnow:submit https://findtheneedle.site/
```

必须先完成生产部署。脚本会检查线上 key 文件、sitemap 中的 URL、页面 HTTP 200、自指 canonical 和 HTML/HTTP noindex 信号，再向 `https://api.indexnow.org/indexnow` 提交。提交前另行核对 `robots.txt` 没有禁止这些页面。

首次配置时，用户已授权提交当前五种语言的可索引页面；从线上 sitemap 保存显式清单，检查后传给脚本。以后仅传需要通知的已发布页面。

HTTP 200 代表接口已收到 URL，不代表已经收录。HTTP 202 代表 key 验证仍在等待，脚本最多间隔 5 秒重试 6 次。

协议参考：https://www.indexnow.org/documentation
