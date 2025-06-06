/**
 * 认证相关的组合式函数
 * 提供用户状态管理和认证操作
 */
export const useAuth = () => {
  const { $trpc } = useNuxtApp()

  // 用户状态
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const isLoading = ref(false)

  /**
   * 获取当前用户信息
   */
  const getCurrentUser = async () => {
    try {
      isLoading.value = true
      const userData = await $trpc.user.me.query()
      user.value = userData
      return userData
    } catch (error) {
      user.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户登录
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      isLoading.value = true
      const result = await $trpc.user.login.mutate(credentials)
      
      if (result.success) {
        user.value = result.user
        await navigateTo('/')
        return { success: true }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '登录失败'
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户注册
   */
  const register = async (data: {
    email: string
    username: string
    password: string
    name?: string
  }) => {
    try {
      isLoading.value = true
      const result = await $trpc.user.register.mutate(data)
      return { success: true, user: result.user }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '注册失败'
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      isLoading.value = true
      await $trpc.user.logout.mutate()
      user.value = null
      await navigateTo('/auth/login')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    isLoading: readonly(isLoading),
    getCurrentUser,
    login,
    register,
    logout
  }
} 