# Nuxt 全栈应用 - 双环境快速设置脚本
# 适用于 Windows PowerShell

param(
    [Parameter(Position = 0)]
    [ValidateSet("dev", "development", "prod", "production", "install", "help")]
    [string]$Action = "help"
)

# 脚本配置
$ProjectName = "Nuxt 全栈应用"
$DevPort = 3000

# 颜色输出函数
function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    
    switch ($Color) {
        "Green" { Write-Host $Text -ForegroundColor Green }
        "Red" { Write-Host $Text -ForegroundColor Red }
        "Yellow" { Write-Host $Text -ForegroundColor Yellow }
        "Blue" { Write-Host $Text -ForegroundColor Blue }
        "Cyan" { Write-Host $Text -ForegroundColor Cyan }
        default { Write-Host $Text }
    }
}

# 检查端口占用
function Test-PortAvailable {
    param([int]$Port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $false  # 端口被占用
    } catch {
        return $true   # 端口可用
    }
}

# 安装依赖
function Install-Dependencies {
    Write-ColorText "🔧 正在安装项目依赖..." "Blue"
    
    if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
        Write-ColorText "❌ 未找到 pnpm，请先安装 pnpm" "Red"
        Write-ColorText "安装命令: npm install -g pnpm" "Yellow"
        exit 1
    }
    
    pnpm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorText "✅ 依赖安装完成" "Green"
    } else {
        Write-ColorText "❌ 依赖安装失败" "Red"
        exit 1
    }
}

# 设置开发环境
function Set-DevelopmentEnvironment {
    Write-ColorText "🛠️  正在设置开发环境..." "Blue"
    
    # 检查环境文件
    if (!(Test-Path ".env.development")) {
        Write-ColorText "❌ 开发环境配置文件不存在: .env.development" "Red"
        exit 1
    }
    
    # 复制环境配置
    Copy-Item ".env.development" ".env" -Force
    Write-ColorText "✅ 已切换到开发环境配置" "Green"
    
    # 检查端口占用
    if (!(Test-PortAvailable -Port $DevPort)) {
        Write-ColorText "⚠️  端口 $DevPort 已被占用，请手动关闭占用进程" "Yellow"
        netstat -ano | findstr ":$DevPort"
    }
    
    # 生成 Prisma 客户端
    Write-ColorText "🔄 正在生成 Prisma 客户端..." "Blue"
    pnpm db:generate
    
    # 推送数据库模式
    Write-ColorText "🗄️  正在同步数据库模式..." "Blue"
    pnpm db:push:dev
    
    Write-ColorText "🚀 开发环境设置完成！" "Green"
    Write-ColorText "数据库: 远程 MongoDB (共享数据库)" "Yellow"
    Write-ColorText "启动命令: pnpm dev" "Cyan"
}

# 设置生产环境
function Set-ProductionEnvironment {
    Write-ColorText "🏭 正在设置生产环境..." "Blue"
    
    # 检查环境文件
    if (!(Test-Path ".env.production")) {
        Write-ColorText "❌ 生产环境配置文件不存在: .env.production" "Red"
        exit 1
    }
    
    # 复制环境配置
    Copy-Item ".env.production" ".env" -Force
    Write-ColorText "✅ 已切换到生产环境配置" "Green"
    
    # 构建应用
    Write-ColorText "🔨 正在构建生产版本..." "Blue"
    pnpm build
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorText "✅ 生产构建完成" "Green"
        Write-ColorText "数据库: 远程 MongoDB (独立生产库)" "Yellow"
        Write-ColorText "启动命令: pnpm start" "Cyan"
    } else {
        Write-ColorText "❌ 生产构建失败" "Red"
        exit 1
    }
}

# 显示帮助信息
function Show-Help {
    Write-ColorText "🔧 $ProjectName - 双环境快速设置工具" "Blue"
    Write-Host ""
    Write-ColorText "用法:" "Yellow"
    Write-Host "  .\scripts\setup-environments.ps1 <action>"
    Write-Host ""
    Write-ColorText "可用操作:" "Yellow"
    Write-Host "  install           安装项目依赖"
    Write-Host "  dev, development  设置开发环境"
    Write-Host "  prod, production  设置生产环境"
    Write-Host "  help              显示帮助信息"
    Write-Host ""
    Write-ColorText "示例:" "Yellow"
    Write-Host "  .\scripts\setup-environments.ps1 install"
    Write-Host "  .\scripts\setup-environments.ps1 dev"
    Write-Host "  .\scripts\setup-environments.ps1 prod"
    Write-Host ""
    Write-ColorText "常用命令:" "Yellow"
    Write-Host "  开发环境: `$env:NUXT_TELEMETRY_DISABLED='1'; pnpm dev"
    Write-Host "  生产环境: pnpm start"
    Write-Host "  数据库管理: pnpm db:studio"
}

# 主逻辑
switch ($Action) {
    "install" {
        Install-Dependencies
    }
    
    { $_ -in @("dev", "development") } {
        Set-DevelopmentEnvironment
    }
    
    { $_ -in @("prod", "production") } {
        Set-ProductionEnvironment
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Write-ColorText "❌ 未知操作: $Action" "Red"
        Show-Help
        exit 1
    }
}

Write-Host ""
Write-ColorText "🎉 操作完成！" "Green" 