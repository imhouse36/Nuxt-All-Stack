<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <NuxtLink
            to="/auth/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            注册新账户
          </NuxtLink>
        </p>
      </div>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="mt-8 space-y-6">
        <UFormGroup label="邮箱" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="请输入邮箱"
            size="lg"
            :disabled="isLoading"
          />
        </UFormGroup>

        <UFormGroup label="密码" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="请输入密码"
            size="lg"
            :disabled="isLoading"
          />
        </UFormGroup>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          :disabled="isLoading"
        >
          登录
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// 设置页面元信息
useHead({
  title: '登录 - Nuxt 全栈应用'
})

// 表单验证架构
const schema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符')
})

// 表单状态
const state = reactive({
  email: '',
  password: ''
})

// 认证状态
const { login, isLoading } = useAuth()
const error = ref('')

// 提交处理
async function onSubmit() {
  error.value = ''
  
  const result = await login({
    email: state.email,
    password: state.password
  })

  if (!result?.success) {
    error.value = result?.error || '登录失败'
  }
}
</script> 