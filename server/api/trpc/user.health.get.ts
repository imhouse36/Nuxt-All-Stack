/**
 * 用户健康检查端点 - 替代 tRPC 的简单实现
 * GET /api/trpc/user.health
 */
export default defineEventHandler(async (event) => {
  try {
    return {
      status: 'ok',
      message: 'API 连接正常！',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Health check failed',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}) 