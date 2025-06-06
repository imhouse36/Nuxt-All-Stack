/**
 * PM2 生产环境部署配置
 * 用于管理生产环境的 Nuxt 应用进程
 */

module.exports = {
  apps: [{
    // 应用基本配置
    name: 'nuxt-fullstack-prod',
    script: '.output/server/index.mjs',
    cwd: '/path/to/your/app',
    
    // 环境配置
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    
    // 进程管理
    instances: 'max',  // 使用所有 CPU 核心
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    
    // 监控配置
    min_uptime: '10s',
    max_restarts: 10,
    
    // 日志配置
    log_file: '/var/log/nuxt-fullstack/combined.log',
    out_file: '/var/log/nuxt-fullstack/out.log',
    error_file: '/var/log/nuxt-fullstack/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // 进程优化
    node_args: '--max-old-space-size=1024',
    
    // 自动重启配置
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // 环境变量文件
    env_file: '.env.production'
  }],

  // 部署配置
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/nuxt-fullstack.git',
      path: '/var/www/nuxt-fullstack',
      
      // 部署前脚本
      'pre-deploy-local': '',
      
      // 部署脚本
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      
      // 部署后脚本
      'post-setup': 'ls -la'
    }
  }
} 