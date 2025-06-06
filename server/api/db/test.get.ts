import { db } from '~/server/db'

/**
 * 数据库连接测试端点
 * GET /api/db/test
 */
export default defineEventHandler(async (event) => {
  try {
    // 尝试连接数据库并执行简单查询
    const userCount = await db.user.count()
    const postCount = await db.post.count()
    
    return {
      status: 'success',
      message: '数据库连接正常！',
      database: {
        connected: true,
        provider: 'MongoDB',
        url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@') || 'Not configured',
        stats: {
          users: userCount,
          posts: postCount
        }
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection failed',
      data: {
        status: 'error',
        message: '数据库连接失败',
        database: {
          connected: false,
          provider: 'MongoDB',
          url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@') || 'Not configured',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      }
    })
  }
}) 