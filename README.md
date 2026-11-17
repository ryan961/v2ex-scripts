# V2EX Lite

整合 V2EX Polish 与 V2EX.REP 常用功能的 V2EX 用户脚本，提供简洁主题、阅读增强和回复辅助，无需部署服务器。

[安装脚本](https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite.user.js) · [版本标签](https://github.com/ryan961/v2ex-scripts/tags) · [问题反馈](https://github.com/ryan961/v2ex-scripts/issues)

## 主要功能

- **阅读增强**：V2EX 原生、Minimalist 与 Arco 清阅主题、主题预览、站内查看大图、新标签页打开和长回复折叠。
- **回复浏览**：多页回复预加载、页码定位和热门回复侧栏。
- **用户管理**：悬浮用户卡片、关注与多标签编辑、分组筛选和标签导入导出。
- **备份与恢复**：默认本地 JSON 迁移，可选 V2EX 记事本及 GitHub、WebDAV、Google Drive。[备份使用说明](docs/backup.md)
- **回复辅助**：浮动回复框、表情选择、Imgur 图片上传和上传记录。
- **日常工具**：自动签到、防窥屏和一键返回顶部。
- **多语言**：简体中文、英语、日语和韩语，可跟随 V2EX 的语言设置。

## 安装与使用

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)，允许浏览器运行用户脚本。
2. 点击 [安装 V2EX Lite](https://raw.githubusercontent.com/ryan961/v2ex-scripts/main/dist/v2ex-lite.user.js)，在脚本管理器中确认安装。
3. 停用 V2EX Polish 和 V2EX.REP，刷新 V2EX 页面，避免功能冲突。

将鼠标移至左下角可显示 **设置** 按钮，也可从网页底部或脚本管理器菜单进入。界面默认使用简体中文，配置、用户标签和上传记录保存在脚本管理器本地。

默认使用 Minimalist，可在设置中切换至 Arco 清阅或 V2EX 原生。主题跟随 V2EX 的浅色、跟随系统和深色设置，增强主题保留现有字体和回复间距。

自动签到、图片上传和表情选择器需要登录 V2EX。图片上传至 Imgur 公共图床。

## 本地开发

使用 Node.js 24.15.0+（24 系列）和 npm，其他受支持版本见 [package.json](package.json)。

```sh
npm ci --ignore-scripts
npm run check
```

`check` 执行格式检查、构建和测试。单独构建使用 `npm run build`，安装文件生成于 `dist/v2ex-lite.user.js`。

## 参考项目

- [V2EX Polish](https://github.com/coolpace/V2EX_Polish)：主题、预览、用户卡片、标签、表情和长回复折叠。
- [V2EX.REP](https://github.com/v2hot/v2ex.rep)：热门回复侧栏和图片上传入口。
- [Arco Design](https://arco.design/)：Arco 清阅配色、标签编辑和设置表单的样式参考。

感谢以上项目及其贡献者。移植代码的版权和许可信息见 [第三方声明](THIRD-PARTY-NOTICES.md)。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
