# Nuxt 全栈应用 - 安装脚本
# 确保在项目根目录执行此脚本

Write-Host "🚀 开始安装 Nuxt 全栈应用..." -ForegroundColor Green

# 检查Node.js版本
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 未找到Node.js，请先安装Node.js 18+版本" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green

# 检查pnpm
$pnpmVersion = pnpm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 未找到pnpm，正在安装..." -ForegroundColor Yellow
    npm install -g pnpm
}
Write-Host "✅ pnpm版本: $(pnpm --version)" -ForegroundColor Green

# 禁用遥测
$env:NUXT_TELEMETRY_DISABLED = "1"

# 安装依赖
Write-Host "📦 正在安装依赖..." -ForegroundColor Blue
pnpm install

# 生成Prisma客户端
Write-Host "🗄️ 正在生成Prisma客户端..." -ForegroundColor Blue
pnpm exec prisma generate

# 准备Nuxt
Write-Host "⚡ 正在准备Nuxt..." -ForegroundColor Blue
pnpm exec nuxt prepare

Write-Host "🎉 安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host "1. 配置数据库连接（编辑 .env 文件中的 DATABASE_URL）"
Write-Host "2. 推送数据库结构：pnpm exec prisma db push"
Write-Host "3. 启动开发服务器：pnpm dev"
Write-Host ""
Write-Host "🔗 访问地址：http://localhost:3000" -ForegroundColor Cyan 