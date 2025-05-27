# liang-note
使用 Vue 3 + Vite 构建的个人博客系统，支持文章管理、分类标签、Markdown 编辑器、评论系统等功能。

后端使用 Spring Boot + MySQL + Redis + RabbitMQ + MinIO
[la-note-java](https://github.com/AngLi1997/la-note-java)

## 技术栈
- vue3
- vue-router 路由管理
- axios 网络请求
- element-plus 组件库
- pinia 状态管理
- markdown-it 渲染 Markdown
- vue-i18n 国际化

# 主要模块
- 分类
- 标签
- 文章
- 吐槽
- 时光轴
- 相册
- 留言板
- 关于我

# 功能特点
## 管理端
- 支持Markdown编辑文章
- 图床
- 分类/标签管理
- 支持评论和回复功能
- 深色/浅色模式
## Portal
- 支持文章浏览、搜索、分类搜索、标签搜索、点赞、收藏、评论

## 目录结构：
```
├── public/             # 公共资源
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── views/          # 页面组件
│   ├── plugins/        # 插件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理（Pinia）
│   ├── utils/          # 工具函数
│   └── App.vue         # 根组件
├── index.html
├── vite.config.ts
└── package.json
```