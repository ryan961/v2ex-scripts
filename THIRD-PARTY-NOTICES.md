# 第三方来源

## V2EX Polish

基于 [c8f1b70fdf13fa17bc842d05949f94ff19bc6cfc](https://github.com/coolpace/V2EX_Polish/tree/c8f1b70fdf13fa17bc842d05949f94ff19bc6cfc)。`src/vendor/polish/` 保留基础主题、Minimalist、通用组件、移动端样式和表情数据，构建时直接编译这些 SCSS。

移植保留上游选择器、配色、间距及组件结构。调整范围包括移除字体下载和字体覆盖、移除或转义中文源码注释与字符串，以及将 jQuery 组件改写为原生 DOM。预览沿用上游 iframe 结构，用户卡片、弹窗、标签和表情选择器沿用上游类名与布局。

版权归 LeoKu 与贡献者所有，适用 [原始 MIT 许可](licenses/v2ex-polish-MIT.txt)。本仓库不包含字体文件，也不请求上游在线字体。

## V2EX.REP

基于 [a5820a221d7832b340a26624b6e2211149ec6397](https://github.com/v2hot/v2ex.rep/tree/a5820a221d7832b340a26624b6e2211149ec6397)。`src/vendor/rep/content.scss` 来自上游样式文件；热评模块移植 `show-top-replies.ts` 和 `cloneReplyElement` 的结构与展示逻辑，上传入口沿用上游类名及布局。

回复索引、分页去重、上传队列、限流处理和持久记录由本项目整合。版权归 Pipecraft 所有，适用 [原始 MIT 许可](licenses/v2ex-rep-MIT.txt)。

## Floating UI

安装文件包含 `@floating-ui/dom`、`@floating-ui/core` 和 `@floating-ui/utils` 的构建代码，版权归 Floating UI contributors 所有，适用 [MIT 许可](licenses/floating-ui-MIT.txt)。

以上许可均嵌入 `dist/v2ex-lite.user.js`，随单文件安装产物分发。
