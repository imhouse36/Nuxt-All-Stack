# Nuxt 全栈应用模板

> 🚀 专业级全栈开发模板，基于 **掌控力优于便利性** 的设计理念

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)

## 📚 目录

- [核心特性](#-核心特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [开发指南](#-开发指南)
- [贡献指南](#-贡献指南)

## ✨ 核心特性

- **🔒 端到端类型安全** - tRPC + Prisma 提供完整类型推断
- **🎯 透明认证系统** - Lucia Auth 实现完全可控的认证逻辑
- **📁 清晰项目架构** - 代码即文档，无魔法配置
- **⚡ 极致开发体验** - Nuxt 3 + Nuxt UI 开箱即用
- **🗄️ 灵活数据建模** - MongoDB + Prisma 支持复杂数据结构

## ⚡ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Nuxt.js 3 | 全栈框架，统一前后端开发 |
| **API** | tRPC | 类型安全的API通信 |
| **ORM** | Prisma | 类型安全的数据库访问 |
| **认证** | Lucia Auth | 灵活透明的身份认证 |
| **UI** | Nuxt UI | 官方UI组件库 + TailwindCSS |
| **数据库** | MongoDB | 文档型数据库 |
| **代码规范** | ESLint + Prettier | 代码格式化与质量检查 |
| **包管理** | pnpm | 高效的包管理工具 |

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- pnpm (推荐) 或 npm
- MongoDB 5.0+

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-repo/nuxt-full-stack
cd nuxt-full-stack

# 2. 安装依赖
pnpm install

# 3. 环境配置
cp .env.example .env
# 编辑 .env 文件，配置数据库连接
# MongoDB 示例配置：
# DATABASE_URL="mongodb://root:g987phj6@dbconn.sealosgzg.site:47094/?directConnection=true"

# 4. 初始化数据库
pnpm prisma db push

# 5. 启动开发服务器
pnpm dev
```

🎉 访问 http://localhost:3000 开始开发！

## 📁 项目结构

```tree
📦 nuxt-full-stack/
├── .env                          # 🔒 环境变量 (数据库连接、密钥等，不上传版本控制)
├── .vscode/                      # ⚙️ 编辑器配置 (可选，提升团队协作效率)
│   └── extensions.json
│
├── components/                   # 🖼️ 【前端】Vue 组件
│   ├── common/                   #  ├─ 通用布局组件 (TheHeader.vue, TheFooter.vue)
│   ├── features/                 #  ├─ ✨ 按业务功能组织的组件 (推荐)
│   │   ├── posts/                #  │   ├─ (PostCard.vue, PostForm.vue)
│   │   └── auth/                 #  │   └─ (LoginForm.vue)
│   │
│   └── ui/                       #  └─ 基础UI封装 (AppButton.vue, AppCard.vue)
│
├── composables/                  # 🪝 【前端】Vue Composables (响应式逻辑)
│   └── useAuth.ts
│
├── layouts/                      # 📐 【前端】页面布局
│   └── default.vue
│
├── middleware/                   # 🚦 【前端】路由中间件
│   └── auth.ts
│
├── pages/                        # 📄 【前端】页面 (文件即路由)
│   └── index.vue
│
├── prisma/                       # 💾 【数据库】Prisma Schema 与迁移
│   └── schema.prisma             #  └─ 定义所有数据模型 (数据库的唯一真实来源)
│
├── public/                       # 📦 【公共资源】无需编译的静态文件
│   └── favicon.ico
│
├── server/                       # 🚀 【后端】所有服务端逻辑
│   ├── api/                      #  ├─ Nuxt 原始API路由
│   │   ├── auth/                 #  │   ├─ ✅ 认证路由 (login.post.ts, logout.post.ts)
│   │   └── trpc/                 #  │   └─ tRPC入口
│   │       └── [trpc].ts         #  │       └─ ✅ tRPC 单一入口点
│   ├── db/                       #  ├─ 【后端】数据库客户端初始化
│   │   └── index.ts              #  │   └─ (初始化并导出 PrismaClient)
│   ├── lib/                      #  ├─ 【后端】核心库/服务封装
│   │   └── auth.ts               #  │   └─ (初始化并导出 Lucia Auth 实例)
│   └── trpc/                     #  └─ 【后端】tRPC 业务路由实现
│       ├── context.ts            #      ├─ 定义 tRPC 上下文
│       ├── index.ts              #      ├─ 根路由 (合并所有子路由)
│       ├── middleware.ts         #      ├─ tRPC 中间件 (如 isAuthenticated)
│       └── routers/              #      └─ ✨ 按功能划分的 tRPC 子路由 (post.ts, user.ts)
│
├── utils/                        # 🛠️ 【通用】非响应式工具函数 (前后端通用或纯前端)
│   └── format.ts
│
├── app.vue                       # Nuxt 应用根组件
├── nuxt.config.ts                # Nuxt 核心配置文件
├── package.json                  # 依赖管理
└── tsconfig.json                 # TypeScript 配置
```

## 🛠️ 开发指南

### 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm start        # 生产启动
pnpm prisma studio # 数据库管理界面
```

### 开发流程

1. **数据建模** - 在 `prisma/schema.prisma` 定义数据结构
2. **API开发** - 在 `server/trpc/routers/` 创建业务逻辑
3. **页面开发** - 在 `pages/` 创建前端页面
4. **组件复用** - 在 `components/` 创建通用组件

### 关键概念

- **类型安全**: 所有API调用都有完整的TypeScript类型提示
- **文件路由**: `pages/` 目录下的文件自动映射为路由
- **自动导入**: 组件和工具函数无需手动import
- **认证透明**: 认证逻辑以标准API形式存在，完全可控

## 🤝 贡献指南

欢迎贡献代码！请遵循以下流程：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

**💡 提示**: 这是一个生产就绪的模板，适合构建需要长期维护的严肃项目。

# ✅ **远程 MongoDB 双环境配置完成！**

我已经成功将您的项目配置为使用远程 MongoDB 数据库。以下是更新的配置概览：

## 📋 **数据库配置**

### **🔧 开发环境**
- **数据库**: `nuxt-fullstack-dev` (开发专用)
- **连接**: `mongodb://root:g987phj6@dbconn.sealosgzg.site:47094/nuxt-fullstack-dev?directConnection=true`

### **🏭 生产环境**  
- **数据库**: `nuxt-fullstack-prod` (生产专用)
- **连接**: `mongodb://root:g987phj6@dbconn.sealosgzg.site:47094/nuxt-fullstack-prod?directConnection=true`

## 🔒 **安全隔离策略**

### **数据库隔离**
- ✅ 开发环境使用 `-dev` 后缀数据库
- ✅ 生产环境使用 `-prod` 后缀数据库
- ✅ 相同服务器，不同数据库实例

### **环境验证更新**
- ✅ 移除本地数据库检查
- ✅ 增加数据库名称后缀验证
- ✅ 防止开发/生产数据库混用

## 🚀 **使用指南**

### **快速切换环境**
```powershell
# 切换到开发环境
.\scripts\setup-environments.ps1 dev

# 切换到生产环境  
.\scripts\setup-environments.ps1 prod
```
