<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 头部 -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🚀 Nuxt 全栈应用模板
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          基于 <strong>掌控力优于便利性</strong> 的设计理念，提供端到端类型安全的全栈开发体验
        </p>
      </header>

      <!-- 技术栈展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="text-2xl mb-3">{{ tech.icon }}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tech.name }}</h3>
          <p class="text-gray-600 text-sm">{{ tech.description }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="text-center space-x-4">
        <UButton size="lg" @click="$router.push('/auth/login')">
          开始体验
        </UButton>
        <UButton variant="outline" size="lg" @click="$router.push('/posts')">
          浏览文章
        </UButton>
      </div>
    </div>
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
    description: '现代化全栈框架，统一前后端开发体验'
  },
  {
    name: 'tRPC',
    icon: '🔒',
    description: '端到端类型安全的API通信解决方案'
  },
  {
    name: 'Prisma',
    icon: '🗄️',
    description: '类型安全的现代数据库访问层'
  },
  {
    name: 'Lucia Auth',
    icon: '🔐',
    description: '灵活透明的身份认证系统'
  },
  {
    name: 'Nuxt UI',
    icon: '🎨',
    description: '官方UI组件库 + TailwindCSS'
  },
  {
    name: 'MongoDB',
    icon: '📊',
    description: '灵活的文档型数据库'
  }
]
</script> 