import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '~/server/trpc'

export default defineNuxtPlugin(() => {
  /**
   * 创建tRPC客户端
   */
  const trpc = createTRPCClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: '/api/trpc',
        // 自动包含cookies用于认证
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include'
          })
        }
      })
    ]
  })

  return {
    provide: {
      trpc
    }
  }
}) 