import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usersApi } from '@/api/client'
import type { User } from '@/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // PUBLIC_INTERFACE
  /**
   * Fetch all users (admin only)
   */
  async function fetchUsers() {
    loading.value = true
    error.value = null
    
    try {
      users.value = await usersApi.getAll()
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch users'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch user by ID (admin only)
   */
  async function fetchUserById(id: number) {
    loading.value = true
    error.value = null
    
    try {
      currentUser.value = await usersApi.getById(id)
      return currentUser.value
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch user'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update user (admin only)
   */
  async function updateUser(id: number, userData: Partial<User>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedUser = await usersApi.update(id, userData)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }
      return updatedUser
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update user'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete user (admin only)
   */
  async function deleteUser(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await usersApi.delete(id)
      users.value = users.value.filter(u => u.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete user'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser
  }
})
