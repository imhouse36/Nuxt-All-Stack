<template>
  <div>
    <!-- Nuxt页面组件 -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// 设置应用元信息
useHead({
  title: 'Nuxt 全栈应用',
  meta: [
    {
      name: 'description',
      content: '基于 Nuxt 3 + tRPC + Prisma + Lucia Auth 的全栈应用模板'
    }
  ]
})
</script> 