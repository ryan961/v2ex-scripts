# 第三方来源

## V2EX Polish

基于 [c8f1b70fdf13fa17bc842d05949f94ff19bc6cfc](https://github.com/coolpace/V2EX_Polish/tree/c8f1b70fdf13fa17bc842d05949f94ff19bc6cfc)。`src/vendor/polish/` 保留基础主题、Minimalist、通用组件、移动端样式和表情数据，构建时直接编译这些 SCSS。

移植保留上游选择器、配色及组件结构。调整范围包括移除字体下载和字体覆盖、保留官方回复字号与行高、按本项目需求调整列表和顶层回复内边距、移除或转义中文源码注释与字符串，以及将 jQuery 组件改写为原生 DOM。预览沿用上游 iframe 结构，列表入口按本项目需求移到标题后并常驻显示；用户卡片沿用上游占位加载、资料、最近发帖和操作区布局。感谢和隐藏图标沿用上游外观，并保留原站操作事件。

版权归 LeoKu 与贡献者所有，适用 [原始 MIT 许可](licenses/v2ex-polish-MIT.txt)。本仓库不包含字体文件，也不请求上游在线字体。

长回复优化沿用同一版本的正文高度判定和折叠样式，将交互接入原始回复、追加回复和主题预览。

## V2EX.REP

基于 [a5820a221d7832b340a26624b6e2211149ec6397](https://github.com/v2hot/v2ex.rep/tree/a5820a221d7832b340a26624b6e2211149ec6397)。`src/vendor/rep/content.scss` 来自上游样式文件；热评模块移植 `show-top-replies.ts` 和 `cloneReplyElement` 的结构与展示逻辑，上传入口沿用上游类名及布局。

回复索引、分页去重、上传队列、限流处理和持久记录由本项目整合。版权归 Pipecraft 所有，适用 [原始 MIT 许可](licenses/v2ex-rep-MIT.txt)。

## Floating UI

安装文件包含 `@floating-ui/dom`、`@floating-ui/core` 和 `@floating-ui/utils` 的构建代码，版权归 Floating UI contributors 所有，适用 [MIT 许可](licenses/floating-ui-MIT.txt)。

## Lucide

爱心与隐藏图标使用 Polish 采用的 [Lucide](https://github.com/lucide-icons/lucide) SVG 路径。图标以静态路径打包，不额外加载图标库。上游的 ISC 与相关 Feather 图标的 MIT 声明保存在 [Lucide 许可](licenses/lucide-LICENSE.txt)。

以上许可均嵌入 `dist/v2ex-lite.user.js`，随单文件安装产物分发。
