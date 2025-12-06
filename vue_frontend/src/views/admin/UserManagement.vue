<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  try {
    await usersStore.fetchUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleDeleteUser = async (userId: number, username: string) => {
  if (userId === authStore.user?.id) {
    alert('You cannot delete your own account')
    return
  }

  if (!confirm(`Are you sure you want to delete user "${username}"?`)) return

  try {
    await usersStore.deleteUser(userId)
  } catch (error) {
    const err = error as { message?: string }
    alert(err.message || 'Failed to delete user')
  }
}

const customerCount = computed(() => {
  return usersStore.users.filter(u => u.role === 'CUSTOMER').length
})

const adminCount = computed(() => {
  return usersStore.users.filter(u => u.role === 'ADMIN').length
})
</script>

<template>
  <div class="user-management">
    <div class="container">
      <h1 class="page-title">User Management</h1>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Users:</span>
          <span class="stat-value">{{ usersStore.users.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Customers:</span>
          <span class="stat-value">{{ customerCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Admins:</span>
          <span class="stat-value">{{ adminCount }}</span>
        </div>
      </div>

      <div v-if="usersStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading users...</p>
      </div>

      <div v-else-if="usersStore.error" class="error">
        <p>{{ usersStore.error }}</p>
        <button @click="usersStore.fetchUsers()" class="retry-btn">Retry</button>
      </div>

      <div v-else class="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <div class="user-info">
                  {{ user.username }}
                  <span v-if="user.id === authStore.user?.id" class="you-badge">You</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['role-badge', user.role.toLowerCase()]">
                  {{ user.role }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button
                  @click="handleDeleteUser(user.id, user.username)"
                  class="delete-btn"
                  :disabled="user.id === authStore.user?.id"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  min-height: 100vh;
  background: #F9FAFB;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.stats {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #374151;
}

.users-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #F9FAFB;
}

th {
  text-align: left;
  padding: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
}

td {
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
  font-size: 14px;
  color: #111827;
}

tr:last-child td {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.you-badge {
  padding: 2px 8px;
  background: #DBEAFE;
  color: #1E40AF;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.customer {
  background: #E0E7FF;
  color: #4338CA;
}

.role-badge.admin {
  background: #FEF3C7;
  color: #92400E;
}

.delete-btn {
  padding: 6px 12px;
  background: #FEE2E2;
  color: #991B1B;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background: #EF4444;
  color: white;
}

.delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.spinner-large {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid #E5E7EB;
  border-top-color: #374151;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error p {
  font-size: 16px;
  color: #EF4444;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #1F2937;
}

@media (max-width: 768px) {
  .stats {
    flex-direction: column;
  }

  .users-table {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}
</style>
