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
        icon="i-heroicons-check-circle"
        color="green"
        variant="subtle"
        title="✅ 系统状态正常"
        description="项目现在可以正常运行，TailwindCSS 样式已启用。接下来将重新集成 tRPC API..."
        class="mb-8"
      />

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
    status: 'pending'
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