# Static publication / 静态发布

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

A release deployment contains the audited `dist/` files and a `deployment.json` recording its source commit and file hashes. Inspect the destination branch before updating it, and use a normal fast-forward publication to preserve its history. The initial site is configured for branch-based Pages publication. Subsequent education updates can rebuild and update this branch without requiring a new core dataset release.

发布目录包含经过审查的构建文件，以及记录源码提交和文件哈希的 `deployment.json`。更新前先核对目标分支，用正常快进保留历史。后续课程更新可独立重建和发布，无需重新发布本体数据版本。

The source revision is traceable through the education release tag and the deployment manifest. GitHub Pages may take several minutes to publish a new branch revision. Verification must fetch the public URL, inspect actual assets and data, and exercise the deployed application; a successful push alone is not a successful website deployment.

教育发布标签与部署清单用于追溯源码。GitHub Pages 可能需要数分钟完成发布；必须从公开地址核验资源、数据和实际操作，不能把 push 成功当作网站发布成功。

## Core independence / 本体独立性

The historical audit against `66751e9` is retained. During this task, upstream independently corrected the repository spelling in the root README in `0b56806`. Publication preserves that upstream change and compares all 7,314 pre-existing files with `docs/publication-base.json` via `npm run verify:publication`. This is an explicit delivery audit, not a future prohibition on core growth.

保留针对 `66751e9` 的历史审计。上游于 `0b56806` 独立修正根 README 名称，发布保留此修改。`npm run verify:publication` 依据新发布基线检查原有 7,314 个文件；它不是以后禁止本体变化的门禁。

When adopting a new atlas snapshot, regenerate the education projection, resolve changed references and recheck mathematical assumptions. Keep the teaching layer's previous snapshot explicitly versioned until that migration is ready. Never silently turn educational layouts, inferred visual proximity or exploratory routes into core mathematical relations.
