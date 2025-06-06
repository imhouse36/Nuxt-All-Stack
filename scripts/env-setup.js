#!/usr/bin/env node

/**
 * 环境配置切换工具
 * 用于在开发环境和生产环境之间切换配置文件
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const PROJECT_ROOT = process.cwd()

/**
 * 复制指定环境的配置文件到 .env
 * @param {string} environment - 环境名称 (development|production)
 */
function switchEnvironment(environment) {
  const sourceFile = resolve(PROJECT_ROOT, `.env.${environment}`)
  const targetFile = resolve(PROJECT_ROOT, '.env')
  
  if (!existsSync(sourceFile)) {
    console.error(`❌ 环境配置文件不存在: .env.${environment}`)
    process.exit(1)
  }
  
  try {
    const envContent = readFileSync(sourceFile, 'utf-8')
    writeFileSync(targetFile, envContent)
    console.log(`✅ 已切换到 ${environment} 环境`)
    console.log(`📄 配置文件: .env.${environment} → .env`)
  } catch (error) {
    console.error(`❌ 切换环境失败:`, error.message)
    process.exit(1)
  }
}

/**
 * 显示当前环境信息
 */
function showCurrentEnvironment() {
  const envFile = resolve(PROJECT_ROOT, '.env')
  
  if (!existsSync(envFile)) {
    console.log('❓ 未找到 .env 文件')
    return
  }
  
  const content = readFileSync(envFile, 'utf-8')
  const nodeEnvMatch = content.match(/NODE_ENV=(.+)/)
  const appNameMatch = content.match(/NUXT_PUBLIC_APP_NAME="(.+)"/)
  
  if (nodeEnvMatch) {
    console.log(`🌍 当前环境: ${nodeEnvMatch[1]}`)
  }
  
  if (appNameMatch) {
    console.log(`📱 应用名称: ${appNameMatch[1]}`)
  }
}

// 命令行参数处理
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'dev':
  case 'development':
    switchEnvironment('development')
    break
    
  case 'prod':
  case 'production':
    switchEnvironment('production')
    break
    
  case 'status':
  case 'current':
    showCurrentEnvironment()
    break
    
  default:
    console.log(`
🔧 环境配置切换工具

用法:
  node scripts/env-setup.js <command>

命令:
  dev, development    切换到开发环境
  prod, production    切换到生产环境
  status, current     显示当前环境信息

示例:
  node scripts/env-setup.js dev
  node scripts/env-setup.js prod
  node scripts/env-setup.js status
`)
    break
} 