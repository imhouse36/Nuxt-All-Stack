import { TRPCError } from '@trpc/server'
import { t } from './index'

/**
 * 认证中间件
 * 确保用户已登录
 */
export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '需要登录才能执行此操作'
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user // 现在 user 是非空的
    }
  })
})

// 创建需要认证的过程
export const protectedProcedure = t.procedure.use(isAuthenticated) 