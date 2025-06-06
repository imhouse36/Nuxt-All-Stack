# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm db:generate

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# 安装 pnpm
RUN npm install -g pnpm

# 复制构建产物
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# 环境变量
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 切换到非 root 用户
USER nuxtjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/.output/server/index.mjs --health-check || exit 1

# 启动应用
CMD ["node", ".output/server/index.mjs"] 