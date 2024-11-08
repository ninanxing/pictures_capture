# 网页图片批量下载助手

一个轻量级的浏览器扩展，支持一键下载网页中的所有图片。适用于Chrome和Edge浏览器。

## 🌟 主要功能
- 一键下载当前网页中的所有图片
- 简单直观的操作界面
- 支持所有网页
- 无需任何配置，即装即用

## 📥 安装方法

### Chrome浏览器
1. 下载并解压本扩展
2. 打开Chrome，在地址栏输入：`chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择解压后的扩展文件夹

### Edge浏览器
1. 下载并解压本扩展
2. 打开Edge，在地址栏输入：`edge://extensions/`
3. 开启左侧的"开发人员模式"
4. 点击"加载解压缩的扩展"
5. 选择解压后的扩展文件夹

## 🚀 使用方法
1. 打开任意网页
2. 点击浏览器工具栏中的绿色图标
3. 在弹出窗口中点击"下载图片"按钮
4. 等待图片下载完成

## 📁 项目结构
pictures_zhua/
├── manifest.json // 扩展配置文件
├── popup.html // 弹出窗口界面
├── content.js // 内容脚本
├── icon.png // 扩展图标
└── README.md // 说明文档
## ⚙️ 技术细节
- 基于Chrome Extension Manifest V3开发
- 使用原生JavaScript实现
- 采用Chrome下载API处理文件下载
- 使用Content Script实现网页内容分析

## 🔒 权限说明
本扩展仅申请必要的权限：
- `downloads`: 用于下载图片
- `tabs`: 访问标签页信息
- `activeTab`: 获取当前标签页
- `host_permissions`: 访问网页内容

## ⚠️ 使用提示
- 部分网站可能限制图片下载
- 下载大量图片时请耐心等待
- 确保设备有足够的存储空间
- 下载的图片将保存在浏览器默认下载目录

## 🔜 开发计划
- [ ] 添加图片预览功能
- [ ] 支持选择性下载
- [ ] 自定义下载路径
- [ ] 添加下载进度显示
- [ ] 支持更多图片格式
- [ ] 添加图片大小筛选

## 🐛 问题反馈
如遇到以下情况，请及时反馈：
1. 扩展无法正常安装或使用
2. 下载功能异常
3. 界面显示问题
4. 其他任何使用问题

## 📝 更新日志
### v1.0.0 (2024-03)
- 首次发布
- 实现基础图片下载功能
- 支持Chrome和Edge浏览器

## 📜 许可证
本项目采用 MIT 许可证开源。这意味着你可以：

### 允许的操作 ✅
- 自由使用：可以在任何地方使用这个软件
- 自由复制：可以复制任意份数
- 自由修改：可以修改源代码
- 自由分发：可以分享给其他人
- 商业使用：可以用于商业目的

### 使用条件 📋
只需要在你的项目中包含以下内容：
1. 原始的许可证文本
2. 版权声明

### 免责说明 ⚠️
本软件按"原样"提供，不提供任何形式的保证，包括但不限于适销性和特定用途适用性的保证。

## 🤝 贡献指南
欢迎提交问题和建议，帮助改进这个扩展！

## 🙏 致谢
感谢所有使用和支持这个扩展的用户。