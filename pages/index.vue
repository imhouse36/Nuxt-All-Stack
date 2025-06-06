<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer class="py-8">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🚀 Nuxt 全栈应用模板
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          基于 <strong>掌控力优于便利性</strong> 的设计理念，提供端到端类型安全的全栈开发体验
        </p>
      </div>

      <!-- 状态提示 -->
      <UAlert
        :icon="trpcStatus.icon"
        :color="trpcStatus.color"
        variant="subtle"
        :title="trpcStatus.title"
        :description="trpcStatus.description"
        class="mb-8"
      />

      <!-- tRPC 测试区域 -->
      <UCard class="mb-8">
        <template #header>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            🔧 <span>tRPC 连接测试</span>
          </h3>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <UButton
              @click="testTrpcConnection"
              :loading="testing"
              color="blue"
              icon="i-heroicons-signal"
            >
              测试 tRPC 连接
            </UButton>
            
            <UBadge
              v-if="testResult"
              :color="testResult.success ? 'green' : 'red'"
              variant="subtle"
            >
              {{ testResult.success ? '连接正常' : '连接失败' }}
            </UBadge>
          </div>
          
          <div v-if="testResult" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <pre class="text-sm">{{ JSON.stringify(testResult, null, 2) }}</pre>
          </div>
        </div>
      </UCard>

      <!-- 技术栈展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <UCard
          v-for="tech in techStack"
          :key="tech.name"
          class="hover:shadow-lg transition-all duration-200"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <div class="text-2xl">{{ tech.icon }}</div>
              <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
            </div>
          </template>
          
          <p class="text-gray-600 dark:text-gray-300 text-sm">{{ tech.description }}</p>
          
          <template #footer>
            <UBadge :color="tech.status === 'active' ? 'green' : 'orange'" variant="soft">
              {{ tech.status === 'active' ? '已启用' : '待集成' }}
            </UBadge>
          </template>
        </UCard>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center gap-4">
        <UButton
          color="primary"
          size="lg"
          icon="i-heroicons-rocket-launch"
        >
          开始体验
        </UButton>
        <UButton
          color="gray"
          variant="outline"
          size="lg"
          icon="i-heroicons-document-text"
        >
          浏览文档
        </UButton>
      </div>

      <!-- 功能预览 -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          🎯 核心功能
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                🔒 <span>类型安全 API</span>
              </h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              基于 tRPC 的端到端类型安全通信，自动类型推断，减少运行时错误
            </p>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                🎨 <span>现代化 UI</span>
              </h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              Nuxt UI + TailwindCSS，提供美观且一致的用户界面组件
            </p>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                🔐 <span>灵活认证</span>
              </h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              Lucia Auth 提供完全可控的身份认证，支持多种认证策略
            </p>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                💾 <span>数据管理</span>
              </h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              Prisma + MongoDB，类型安全的数据库操作和灵活的数据建模
            </p>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// 设置页面元信息
useHead({
  title: '首页 - Nuxt 全栈应用'
})

// tRPC 测试状态
const testing = ref(false)
const testResult = ref<any>(null)

// 动态状态显示
const trpcStatus = computed(() => {
  if (testResult.value === null) {
    return {
      icon: 'i-heroicons-signal',
      color: 'blue',
      title: '🔧 tRPC 已集成',
      description: 'tRPC API 适配器已重新配置完成，点击下方按钮测试连接状态。'
    }
  }
  
  if (testResult.value.success) {
    return {
      icon: 'i-heroicons-check-circle',
      color: 'green',
      title: '✅ tRPC 连接正常',
      description: 'API 通信正常，端到端类型安全已启用。'
    }
  }
  
  return {
    icon: 'i-heroicons-x-circle',
    color: 'red',
    title: '❌ tRPC 连接异常',
    description: '请检查服务器状态和网络连接。'
  }
})

// 测试 tRPC 连接
async function testTrpcConnection() {
  testing.value = true
  testResult.value = null
  
  try {
    // 使用 fetch 直接调用 tRPC API
    const response = await $fetch('/api/trpc/user.health', {
      method: 'GET'
    })
    
    testResult.value = {
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('tRPC 测试失败:', error)
    testResult.value = {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }
  } finally {
    testing.value = false
  }
}

// 技术栈数据
const techStack = [
  {
    name: 'Nuxt.js 3',
    icon: '⚡',
    description: '现代化全栈框架，统一前后端开发体验',
    status: 'active'
  },
  {
    name: 'Nuxt UI',
    icon: '🎨',
    description: '官方UI组件库 + TailwindCSS，现已启用',
    status: 'active'
  },
  {
    name: 'tRPC',
    icon: '🔒',
    description: '端到端类型安全的API通信解决方案',
    status: 'active'
  },
  {
    name: 'Prisma',
    icon: '🗄️',
    description: '类型安全的现代数据库访问层',
    status: 'active'
  },
  {
    name: 'Lucia Auth',
    icon: '🔐',
    description: '灵活透明的身份认证系统',
    status: 'active'
  },
  {
    name: 'MongoDB',
    icon: '📊',
    description: '灵活的文档型数据库',
    status: 'active'
  }
]
</script> 