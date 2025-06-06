// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 兼容性日期配置 - 消除启动警告
  compatibilityDate: '2025-01-06',
  
  // 启用 Nuxt UI 模块 (包含 TailwindCSS)
  modules: [
    '@nuxt/ui'
  ],
  
  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    
    // 公共环境变量
    public: {
      appName: 'Nuxt 全栈应用'
    }
  }
}) 