import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { router, publicProcedure } from '../index'
import { protectedProcedure } from '../middleware'

/**
 * 用户相关API路由
 */
export const userRouter = router({
  // 获取当前用户信息
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),

  // 用户注册
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('邮箱格式不正确'),
        username: z.string().min(3, '用户名至少3个字符'),
        password: z.string().min(6, '密码至少6个字符'),
        name: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, username, password, name } = input

      // 检查用户是否已存在
      const existingUser = await ctx.db.user.findFirst({
        where: {
          OR: [{ email }, { username }]
        }
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '邮箱或用户名已被使用'
        })
      }

      // 创建用户
      const user = await ctx.auth.createUser({
        key: {
          providerId: 'email',
          providerUserId: email.toLowerCase(),
          password
        },
        attributes: {
          email: email.toLowerCase(),
          username,
          name: name || username
        }
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name
        }
      }
    }),

  // 用户登录
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input

      try {
        const key = await ctx.auth.useKey('email', email.toLowerCase(), password)
        const session = await ctx.auth.createSession({
          userId: key.userId,
          attributes: {}
        })

        const authRequest = ctx.auth.handleRequest(ctx.event)
        authRequest.setSession(session)

        return {
          success: true,
          user: session.user
        }
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '邮箱或密码错误'
        })
      }
    }),

  // 用户登出
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const authRequest = ctx.auth.handleRequest(ctx.event)
    const session = await authRequest.validate()

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: '未登录'
      })
    }

    await ctx.auth.invalidateSession(session.sessionId)
    authRequest.setSession(null)

    return { success: true }
  })
}) 