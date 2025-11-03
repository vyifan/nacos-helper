# nacos-helper

一个用于优化 Nacos 配置管理界面的 Chrome 扩展插件。

## 功能特性

### 1. URL条件显示
- 当URL包含 `/configdetail` 时，插件会在页面上显示辅助按钮
- 当URL包含 `/configeditor` 时，插件会在页面上显示辅助按钮

### 2. 全屏功能
- 全屏按钮始终显示在屏幕底部中央的工具条中
- 工具条包含全屏按钮和页面原有按钮（通过查找"返回"按钮的同级元素确定）
- 点击全屏按钮可以切换容器元素的全屏显示状态

## 安装方法

1. 打开 Chrome 浏览器的扩展管理页面（chrome://extensions/）
2. 开启开发者模式
3. 点击 "加载已解压的扩展程序"
4. 选择 nacos-helper 文件夹



## 项目结构

- `manifest.json`: 插件配置文件
- `content.js`: 插件核心逻辑文件
- `tampermonkey.js`: 油猴脚本
- `README.md`: 说明文档
