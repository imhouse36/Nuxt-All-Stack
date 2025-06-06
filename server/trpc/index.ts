import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import superjson from 'superjson'
import type { Context } from './context'
import { userRouter } from './routers/user'
import { postRouter } from './routers/post'

/**
 * 初始化tRPC
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    }
  }
})

/**
 * 创建路由器和过程
 */
export const router = t.router
export const publicProcedure = t.procedure

/**
 * 应用根路由
 * 合并所有功能路由
 */
export const appRouter = router({
  user: userRouter,
  post: postRouter
})

export type AppRouter = typeof appRouter 