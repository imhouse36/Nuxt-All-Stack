import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure } from '../index'
import { protectedProcedure } from '../middleware'

/**
 * 文章相关API路由
 */
export const postRouter = router({
  // 获取文章列表
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        published: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, published } = input

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: published !== undefined ? { published } : undefined,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      let nextCursor: string | undefined = undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem?.id
      }

      return {
        posts,
        nextCursor
      }
    }),

  // 获取单篇文章
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在'
        })
      }

      return post
    }),

  // 创建文章
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, '标题不能为空'),
        content: z.string().min(1, '内容不能为空'),
        published: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          ...input,
          authorId: ctx.user.id
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      return post
    }),

  // 更新文章
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        published: z.boolean().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      // 检查文章是否存在且用户有权限
      const existingPost = await ctx.db.post.findUnique({
        where: { id }
      })

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在'
        })
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: '无权限修改此文章'
        })
      }

      const post = await ctx.db.post.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      return post
    }),

  // 删除文章
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 检查文章是否存在且用户有权限
      const existingPost = await ctx.db.post.findUnique({
        where: { id: input.id }
      })

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在'
        })
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: '无权限删除此文章'
        })
      }

      await ctx.db.post.delete({
        where: { id: input.id }
      })

      return { success: true }
    })
}) 