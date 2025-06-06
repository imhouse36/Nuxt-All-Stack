import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server/trpc'
import { createContext } from '~/server/trpc/context'

/**
 * tRPC API入口点
 * 处理所有 /api/trpc/* 路由
 */
export default defineEventHandler(async (event) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: event.node.req,
    router: appRouter,
    createContext: () => createContext(event)
  })
}) 