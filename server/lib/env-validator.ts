/**
 * 环境变量验证工具
 * 确保必需的环境变量在启动时已正确配置
 */

import { z } from 'zod'

// 定义环境变量模式
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, '数据库连接字符串不能为空'),
  AUTH_SECRET: z.string().min(32, '认证密钥至少需要32个字符'),
  
  // 可选配置
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // 公共配置
  NUXT_PUBLIC_APP_NAME: z.string().default('Nuxt 全栈应用'),
  NUXT_PUBLIC_TRPC_BASE_URL: z.string().url().default('http://localhost:3000'),
  NUXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
})

// 环境特定验证规则
const developmentEnvSchema = envSchema.extend({
  DATABASE_URL: z.string().refine(
    (url) => url.includes('mongodb://'),
    '开发环境数据库必须是有效的 MongoDB 连接字符串'
  ),
})

const productionEnvSchema = envSchema.extend({
  AUTH_SECRET: z.string().min(64, '生产环境认证密钥至少需要64个字符'),
  DATABASE_URL: z.string().refine(
    (url) => url.includes('mongodb://') && !url.includes('-dev'),
    '生产环境数据库不应包含开发标识'
  ),
  SMTP_HOST: z.string().min(1, '生产环境必须配置邮件服务'),
  SMTP_USER: z.string().min(1, '生产环境必须配置邮件用户'),
  SMTP_PASS: z.string().min(1, '生产环境必须配置邮件密码'),
})

/**
 * 验证环境变量
 */
export function validateEnvironment() {
  const env = process.env
  
  try {
    // 根据环境选择不同的验证模式
    if (env.NODE_ENV === 'production') {
      productionEnvSchema.parse(env)
      console.log('✅ 生产环境变量验证通过')
    } else if (env.NODE_ENV === 'development') {
      developmentEnvSchema.parse(env)
      console.log('✅ 开发环境变量验证通过')
    } else {
      envSchema.parse(env)
      console.log('✅ 环境变量验证通过')
    }
    
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ 环境变量验证失败:')
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    } else {
      console.error('❌ 环境验证异常:', error)
    }
    
    return false
  }
}

/**
 * 获取验证后的环境配置
 */
export function getValidatedEnv() {
  const isValid = validateEnvironment()
  
  if (!isValid) {
    throw new Error('环境变量验证失败，请检查配置')
  }
  
  return {
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    DATABASE_URL: process.env.DATABASE_URL!,
    AUTH_SECRET: process.env.AUTH_SECRET!,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    REDIS_URL: process.env.REDIS_URL,
    LOG_LEVEL: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  }
}

/**
 * 开发环境安全检查
 */
export function checkDevelopmentSafety() {
  if (process.env.NODE_ENV !== 'development') return
  
  const warnings: string[] = []
  
  // 检查是否使用生产数据库
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('-prod')) {
    warnings.push('⚠️  开发环境正在连接生产数据库，请确认这是预期行为')
  }
  
  // 检查数据库名称是否包含开发标识
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('-dev')) {
    warnings.push('⚠️  开发环境建议使用包含 "-dev" 标识的数据库名称')
  }
  
  // 检查认证密钥
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 32) {
    warnings.push('⚠️  认证密钥过短，建议使用更长的密钥')
  }
  
  if (warnings.length > 0) {
    console.log('\n🔍 开发环境安全检查:')
    warnings.forEach(warning => console.log(warning))
    console.log('')
  }
}

/**
 * 生产环境安全检查
 */
export function checkProductionSafety() {
  if (process.env.NODE_ENV !== 'production') return
  
  const errors: string[] = []
  
  // 检查是否使用默认密钥
  if (process.env.AUTH_SECRET === 'your-super-secret-auth-key-change-in-production') {
    errors.push('🚨 生产环境仍在使用默认认证密钥，存在安全风险！')
  }
  
  // 检查是否使用开发数据库
  if (process.env.DATABASE_URL?.includes('-dev')) {
    errors.push('🚨 生产环境不应连接开发数据库！')
  }
  
  if (errors.length > 0) {
    console.error('\n🔒 生产环境安全检查失败:')
    errors.forEach(error => console.error(error))
    console.error('\n请立即修复以上问题后重新启动应用！\n')
    throw new Error('生产环境安全检查失败')
  }
} 