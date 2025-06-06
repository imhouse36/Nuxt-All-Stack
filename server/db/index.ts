import { PrismaClient } from '@prisma/client'

/**
 * 全局数据库客户端实例
 * 在开发环境中避免重复连接，生产环境使用单例模式
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db 