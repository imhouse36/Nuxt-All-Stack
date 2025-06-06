import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { db } from '~/server/db'

/**
 * Lucia Auth 配置
 * 提供完全透明的认证系统，支持自定义认证逻辑
 */
export const auth = new Lucia(
  new PrismaAdapter(db.session, db.user),
  {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === 'production'
      }
    },
    getUserAttributes: (attributes) => {
      return {
        id: attributes.id,
        email: attributes.email,
        username: attributes.username,
        name: attributes.name,
        avatar: attributes.avatar,
        createdAt: attributes.createdAt,
        updatedAt: attributes.updatedAt
      }
    }
  }
)

export type Auth = typeof auth

// 声明类型模块
declare module 'lucia' {
  interface Register {
    Lucia: typeof auth
    DatabaseUserAttributes: {
      id: string
      email: string
      username: string
      name: string | null
      avatar: string | null
      createdAt: Date
      updatedAt: Date
    }
  }
} 