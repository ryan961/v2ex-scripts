# 备份与恢复

在 V2EX Lite 设置中打开「备份与恢复」。设置和标签始终先保存到脚本管理器。备份包含普通设置、标签和标签删除标记。签到状态、上传历史、Imgur 配置和云端凭据留在本地。

| 方式              | 备份上限                                                                                 | 恢复方式                                      |
| ----------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| 本地 JSON（默认） | 每份 2,000,000 字节、20,000 条用户记录。最多 128 个分卷。                                | 选择 JSON。分卷需同时选中同一备份的所有文件。 |
| V2EX 记事本       | Lite 限制为每份 65,536 字节，含备份标记，最多 20,000 条用户记录。V2EX 实际容量可能更低。 | 用同一 V2EX 账号打开「从记事本恢复」。        |
| 自选云端          | 每份 2,000,000 字节、20,000 条用户记录，同时受目标服务配额约束。                         | 从云端工具下载 JSON，再在 V2EX Lite 导入。    |

大小以 UTF-8 字节数计算。每位用户最多 20 个标签，每个标签最多 80 个 UTF-16 码元。本地存储总容量由脚本管理器决定。超出记事本或云端上限时，可转用本地分卷。

恢复前可以查看新增、删除标记、冲突和有变化的设置。默认只补充本地缺少的标签记录，并保留本地删除标记。恢复普通设置需要单独选中，保存后刷新即可应用。也可导入 Polish、V2Next 记事本及 UTags v3 格式中的 V2EX 用户标签。

## V2EX 记事本

选择「V2EX 记事本」，点击「备份到记事本」并核对账号。每个账号使用一条以 `V2EX_Lite_settings` 开头的专用笔记。操作会更新上一份备份，并读回笔记核对内容。准备从另一台设备更新前，先确认哪台设备有最新数据。

## 云端备份工具

在项目目录安装依赖并构建工具。服务器仅监听本机回环地址。

```sh
npm ci --ignore-scripts
npm run build
npm run backup:cloud
```

打开 [本机云端工具](http://localhost:8765/)，或通过 Lite 设置中的入口进入。先从 Lite 导出 JSON，再在工具页选择文件和后端，点击上传。恢复时下载 JSON，回到 Lite 导入并检查预览。凭据只在当前工具页使用。

- **GitHub**：准备已初始化的私有仓库，为该仓库生成仅具备 Contents 读写权限的令牌。工具更新默认分支上的 `v2ex-lite-backup.json`，写入使用当前文件的 SHA。GitHub 普通文件上限为 100 MiB，工具仍以表中较小的限制为准。[GitHub 文件限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- **WebDAV**：填写 HTTPS 文件地址，例如 `https://example.org/dav/v2ex-lite-backup.json`。允许工具来源 `http://localhost:8765` 的跨域 `GET`、`PUT` 和预检，允许 `Authorization`、`Content-Type`、`If-Match`、`If-None-Match` 请求头，并暴露 `ETag` 响应头。更新已有备份要求服务端支持强 ETag 和条件写入。实际容量取决于服务商和服务器配置。[WebDAV 规范](https://www.rfc-editor.org/rfc/rfc4918)
- **Google Drive**：在 Google Cloud 项目中启用 Drive API，创建 Web 应用 OAuth 客户端，将 `http://localhost:8765` 加入已授权的 JavaScript 来源。若授权应用处于测试状态，把使用的 Google 账号加入测试用户。工具只请求 `drive.file`，每次上传创建一份可在 Drive 中看到的快照。跨设备时使用同一个 OAuth 客户端和 Google 账号。个人账号通常有 15 GB 共享空间，Drive 普通文件上限为 5 TB。[Google 授权设置](https://developers.google.com/workspace/drive/api/quickstart/js) · [账号容量](https://support.google.com/drive/answer/9312312) · [单文件限制](https://support.google.com/drive/answer/37603)

已有自己的 HTTPS 站点时，也可以部署构建后的 `docs/backup` 目录。部署 Google Drive 功能时，将该 HTTPS 来源加入同一 OAuth 客户端。三个后端均通过手动操作备份和恢复。
