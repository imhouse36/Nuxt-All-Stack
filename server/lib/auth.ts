import { lucia } from 'lucia'
import { prisma } from '@lucia-auth/adapter-prisma'
import { h3 } from 'lucia/middleware'
import { db } from '~/server/db'

/**
 * Lucia Auth 配置
 * 提供完全透明的认证系统，支持自定义认证逻辑
 */
export const auth = lucia({
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: h3(),
  adapter: prisma(db, {
    user: 'user',
    key: 'key',
    session: 'session'
  }),
  getUserAttributes: (data) => {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      name: data.name,
      avatar: data.avatar,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }
})

export type Auth = typeof auth 