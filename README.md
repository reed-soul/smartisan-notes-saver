# Smartisan Notes Exporter

一个用于导出锤子便签内容的 Chrome 扩展程序。支持将便签导出为 Markdown 格式，并保持原有的文件夹分类结构。


## 功能特点

- 一键导出所有便签内容
- 保持原有的文件夹分类结构
- 导出格式为 Markdown
- 保留便签的修改时间信息
- 自动处理未分类便签
- 支持批量导出为 ZIP 压缩包

## 安装方法

### 从 Chrome 网上应用店安装

1. [访问 Chrome 网上应用店](https://chromewebstore.google.com/detail/%E9%94%A4%E5%AD%90%E4%BE%BF%E7%AD%BE%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B/ikmdiigdockckbnfglpnlibjhdapkapf?hl=zh-CN&authuser=0)
2. 点击"添加到 Chrome"按钮
3. 确认安装

### 手动安装（开发者模式）

1. 下载本项目的发布的 ZIP 文件并解压
2. 打开 Chrome 浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择解压后的文件夹

## 使用方法

1. 登录锤子便签网页版 (note.smartisan.com)
2. 页面右上角会出现"导出 Markdown"按钮
3. 点击按钮，等待导出完成
4. 自动下载包含所有便签的 ZIP 文件

## 导出文件说明

- 导出的 ZIP 文件包含多个文件夹，对应您在锤子便签中的分类
- 未分类的便签会被放入"未分类"文件夹
- 每个便签文件都是 Markdown 格式（.md 后缀）
- 文件名为便签的标题（已处理特殊字符）
- 每个便签文件的内容格式如下：
  ```markdown
  修改时间：YYYY-MM-DD HH:mm:ss

  便签正文内容...
  ```

## 隐私说明

- 本扩展程序仅在 note.smartisan.com 域名下运行
- 仅读取便签数据用于导出，不会上传或分享您的数据
- 所有操作均在本地完成，无需联网

## 技术说明

### 依赖库
- [JSZip](https://stuk.github.io/jszip/) v3.10.1 - 用于生成 ZIP 压缩包
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) v2.0.5 - 用于文件下载

### 实现原理
- 使用 IndexedDB 直接读取便签数据
- 使用 JSZip 处理文件打包
- 使用 FileSaver.js 处理文件下载

## 已知问题

- 暂不支持便签中的图片导出
- 暂不支持便签的样式导出

## 更新日志

### v1.0
- 初始版本发布
- 支持批量导出所有便签
- 支持保持文件夹分类
- 支持导出修改时间

## 贡献代码

欢迎提交 Issue 和 Pull Request。


## 许可证

MIT License
