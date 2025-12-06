import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/client'
import type { User, LoginRequest, RegisterRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // PUBLIC_INTERFACE
  /**
   * Initialize auth state from local storage
   */
  function initAuth() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        clearAuth()
      }
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Login user with credentials
   */
  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Register new user
   */
  async function register(userData: RegisterRequest) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.register(userData)
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Logout current user
   */
  async function logout() {
    loading.value = true
    
    try {
      await authApi.logout()
    } catch {
      // Continue with logout even if API call fails
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Clear authentication state
   */
  function clearAuth() {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch current user profile
   */
  async function fetchCurrentUser() {
    if (!token.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch user'
      clearAuth()
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    register,
    logout,
    clearAuth,
    fetchCurrentUser
  }
})
