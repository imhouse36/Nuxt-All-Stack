// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发工具配置 - 仅在开发环境启用
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  // 兼容性日期配置 - 消除启动警告
  compatibilityDate: '2025-01-06',
  
  // 启用 Nuxt UI 模块 (包含 TailwindCSS)
  modules: [
    '@nuxt/ui'
  ],
  
  // 服务端渲染配置
  ssr: true,
  
  // 运行时配置
  runtimeConfig: {
    // 私有环境变量 (仅服务端可访问)
    databaseUrl: process.env.DATABASE_URL || '',
    authSecret: process.env.AUTH_SECRET || '',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    redisUrl: process.env.REDIS_URL || '',
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // 公共环境变量 (客户端也可访问)
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Nuxt 全栈应用',
      trpcBaseUrl: process.env.NUXT_PUBLIC_TRPC_BASE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      cdnUrl: process.env.CDN_URL || '',
      analyticsId: process.env.ANALYTICS_ID || ''
    }
  },
  
  // 构建配置
  nitro: {
    // 环境特定配置
    experimental: {
      wasm: true
    },
    // 生产环境压缩
    compressPublicAssets: process.env.NODE_ENV === 'production'
  },
  
  // 开发服务器配置
  devServer: {
    host: process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
    port: 3000
  },
  
  // CSS 配置
  css: process.env.NODE_ENV === 'production' ? [] : ['~/assets/css/dev.css'],
  
  // 构建优化
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['trpc-nuxt'] : []
  }
}) 