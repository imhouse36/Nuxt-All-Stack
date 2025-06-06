import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { setCookie } from 'h3'
import { router, publicProcedure } from '../index'
import { protectedProcedure } from '../middleware'

/**
 * 用户相关API路由
 */
export const userRouter = router({
  // 健康检查端点 - 测试 tRPC 连接
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'tRPC 连接正常！',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  }),

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

      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 12)

      // 创建用户
      const user = await ctx.db.user.create({
        data: {
          email: email.toLowerCase(),
          username,
          name: name || username,
          hashedPassword
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

      // 查找用户
      const user = await ctx.db.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '邮箱或密码错误'
        })
      }

      // 验证密码
      const validPassword = await bcrypt.compare(password, user.hashedPassword)
      if (!validPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '邮箱或密码错误'
        })
      }

      // 创建会话
      const session = await ctx.auth.createSession(user.id, {})
      const sessionCookie = ctx.auth.createSessionCookie(session.id)

      // 设置cookie
      setCookie(ctx.event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          avatar: user.avatar
        }
      }
    }),

  // 用户登出
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: '未登录'
      })
    }

    await ctx.auth.invalidateSession(ctx.session.id)
    
    const sessionCookie = ctx.auth.createBlankSessionCookie()
    setCookie(ctx.event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return { success: true }
  })
}) 