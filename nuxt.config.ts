// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 模块配置
  modules: [
    '@nuxt/ui'
  ],

  // 自动导入配置
  imports: {
    dirs: ['utils', 'composables']
  },

  // CSS配置
  css: ['~/assets/main.css'],

  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    
    // 公共环境变量
    public: {
      appName: 'Nuxt 全栈应用'
    }
  },

  // TypeScript配置
  typescript: {
    strict: true,
    typeCheck: true
  },

  // 构建配置
  nitro: {
    experimental: {
      wasm: true
    }
  }
}) 