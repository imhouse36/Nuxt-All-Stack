import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { auth } from '~/server/lib/auth'
import { db } from '~/server/db'

/**
 * 创建tRPC上下文
 * 为每个请求提供数据库客户端和认证信息
 */
export async function createContext(event: H3Event) {
  // 从请求中获取认证会话
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()

  return {
    event,
    db,
    auth,
    user: session?.user ?? null,
    session: session
  }
}

export type Context = inferAsyncReturnType<typeof createContext> 