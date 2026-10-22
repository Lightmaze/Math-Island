# Static publication / 静态发布

## Actual delivery / 实际交付

- **Sites:** https://mathcups-mathematical-islands.ljie5996.chatgpt.site — deployment succeeded at 2026-10-22 15:08 UTC; audience remains owner-private. / 部署成功，当前仅创建者可访问。
- **Public source:** https://github.com/Lightmaze/Math-Island/tree/main/education
- **Public static release:** https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.1.0.zip — extract, run `python -m http.server 8000` in the extracted directory, then open `http://localhost:8000`. No build or Node is required. / 解压后直接静态服务，无需编译。
- **GitHub Pages:** not enabled. The integration returned HTTP 403, `Resource not accessible by integration`, when creating Pages. This is a hosting-permission boundary, not an application build failure. / 尚未启用；当前连接没有 Pages 创建权限，不能将预期网址称为已上线。

The owner can enable Pages in [repository Settings → Pages](https://github.com/Lightmaze/Math-Island/settings/pages), choosing **Deploy from a branch → education-pages → / (root)**. The complete audited files are already on that branch. After GitHub finishes, verify the URL it reports before replacing lesson links.

仓库所有者可在上述设置页选择 **Deploy from a branch → education-pages → / (root)**。经过核验的完整文件已在该分支；等待 GitHub 完成并核验其返回的网址后，再调整课程链接。

[Hosting evidence](../evidence/hosting.json) records exact Sites IDs, commits and artifact hashes. Native Sites deployment success is the hosting verification; local production-browser checks cover the application itself. No sign-in bypass was generated and no private browser session was accessed.

托管证据记录实际部署结果与哈希。应用操作在本地生产产物上验证；没有绕过 Sites 登录门，也未声称重新操控了登录后的线上页面。

The education module builds into a self-contained static directory. It has no backend credentials, database migration, or write path to the mathematical core. Source publication and static hosting are separate from core dataset releases.

教育模块构建为独立静态目录，无服务端凭证、数据库迁移或数学本体写入通道。源码发布、网站发布与本体数据版本分别管理。

## Reproduce the application / 重建应用

```bash
cd education
npm ci
npm test
npm run build
npm run test:browser
npm run test:a11y
```

The browser checks use an installed Chromium (`/usr/bin/chromium` when available), `CHROMIUM_PATH`, or Playwright's managed Chromium. If needed, install the latter with `npx playwright install chromium`. The audit scripts create an isolated local static server; browser storage and deliberately injected failures are confined to their test contexts. Reports are written under `test-results/`, which is excluded from Git. Reviewed release evidence is copied explicitly into `evidence/`.

浏览器审查可使用系统 Chromium、`CHROMIUM_PATH` 指定的浏览器，或 Playwright 安装的 Chromium。必要时运行 `npx playwright install chromium`。脚本使用隔离的本地静态服务和浏览器上下文；故障注入不会修改本体数据。测试输出在被 Git 忽略的 `test-results/`，正式证据经复核后另存到 `evidence/`。

`dist/` uses relative asset paths and hash navigation, so it can be served at `/` or `/Math-Island/`. Source attribution and upstream/runtime license texts are included. The mathematical index, edge table and literature guides are fetched only when the full-atlas view is opened; laboratories are a separate lazy-loaded module. Scenic images load as their islands approach the viewport.

`dist/` 使用相对资源路径与 hash 路由，可托管在根路径或 `/Math-Island/`。其中包含来源说明与上游/运行时许可文本。完整索引、关系与文献指南仅在进入全部图谱时获取，实验模块独立延迟加载；地貌图像接近视口时再加载。

## GitHub Pages publication / GitHub Pages 发布

The public repository's canonical name is **Lightmaze/Math-Island**. The earlier `Mafh-Island` spelling redirects on GitHub. The static deployment uses the independent **education-pages** branch at its root, with `.nojekyll`; the main branch retains the source in `education/`. No root workflow, core dataset, root release manifest or original map is rewritten to deploy the site.

公开仓库现名为 **Lightmaze/Math-Island**，GitHub 会重定向此前拼写。网站使用独立 **education-pages** 分支根目录，并包含 `.nojekyll`；源码仍在主分支的 `education/`。部署不改写根目录工作流、本体数据、原始发布清单或原图。

A release deployment contains the audited `dist/` files and a `deployment.json` recording its source commit and file hashes. Inspect the destination branch before updating it, and use a normal fast-forward publication to preserve its history. The branch is prepared for branch-based Pages publication, but enabling the site requires the owner because the current integration lacks the Pages permission. Subsequent education updates can rebuild and update this branch without requiring a new core dataset release.

发布目录包含经过审查的构建文件，以及记录源码提交和文件哈希的 `deployment.json`。更新前先核对目标分支，用正常快进保留历史。后续课程更新可独立重建和发布，无需重新发布本体数据版本。

The public static revision is traceable through `education-static-v0.1.0` and its deployment manifest; the source release is separately tagged. GitHub Pages may take several minutes to publish a new branch revision. Verification must fetch the public URL, inspect actual assets and data, and exercise the deployed application; a successful push alone is not a successful website deployment.

教育发布标签与部署清单用于追溯源码。GitHub Pages 可能需要数分钟完成发布；必须从公开地址核验资源、数据和实际操作，不能把 push 成功当作网站发布成功。

## Core independence / 本体独立性

The historical audit against `66751e9` is retained. During this task, upstream independently corrected the repository spelling in the root README in `0b56806`. Publication preserves that upstream change and compares all 7,314 pre-existing files with `docs/publication-base.json` via `npm run verify:publication`. This is an explicit delivery audit, not a future prohibition on core growth.

保留针对 `66751e9` 的历史审计。上游于 `0b56806` 独立修正根 README 名称，发布保留此修改。`npm run verify:publication` 依据新发布基线检查原有 7,314 个文件；它不是以后禁止本体变化的门禁。

When adopting a new atlas snapshot, regenerate the education projection, resolve changed references and recheck mathematical assumptions. Keep the teaching layer's previous snapshot explicitly versioned until that migration is ready. Never silently turn educational layouts, inferred visual proximity or exploratory routes into core mathematical relations.


## Sites source and artifact / Sites 源码与产物

`education/.openai/hosting.json` stores the existing Site project ID and `static.directory: dist`. Reuse that project; do not create duplicates. A separate Site source checkout was committed and pushed to its provisioned repository. Building that exact commit reproduced all 26 application files byte for byte. The deployment archive contains only `.openai/hosting.json` and `dist/`. Credentials passed through hidden stdin into a temporary process environment; none are stored in this repository.

Sites 使用独立源码版本库，应用构建与 GitHub 静态版的26个文件逐字节一致。修改时复用已记录的项目 ID；部署包只包含托管配置和静态目录。仓库中不保存认证令牌。本次因插件辅助脚本在执行环境中不可用，按同一凭据与归档契约完成了 Git 同步和打包。


## Public package verification / 公开包核验

The immutable static ZIP was downloaded again from GitHub (HTTP 200, 11,664,085 bytes). Its 27 declared payloads matched every byte length and SHA-256; the exact 28-file set includes the self-describing manifest. Four isolated Chromium configurations—Chinese/English at 1440 px and 390 px—served only this extracted copy under `/Math-Island/`. Home, noncommuting D₄ operations, the heat experiment, the full atlas/literature bridge, and persisted/exported notes all passed. No request escaped the subpath and no resource or runtime error was observed. See [the complete evidence](../evidence/static-package.json).

重新从GitHub下载公开包后，27载荷逐项哈希通过。中英文×桌面/手机四配置、每配置五个场景全部通过；只使用解压副本，未借用工作区dist。此项确认公开分发包及子路径部署可用，不冒称Pages公网已上线。

Reproduce the focused checks from a full source checkout with dependencies installed:

```bash
node scripts/cache-audit.mjs
node scripts/static-package-audit.mjs
```
