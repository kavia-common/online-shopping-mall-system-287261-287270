<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useOrdersStore } from '@/stores/orders'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const usersStore = useUsersStore()

const loading = ref(true)

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  try {
    await Promise.all([
      productsStore.fetchProducts(),
      ordersStore.fetchAllOrders(),
      usersStore.fetchUsers()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})

const totalRevenue = ref(0)
totalRevenue.value = ordersStore.orders.reduce((sum, order) => sum + order.totalAmount, 0)

const pendingOrders = ref(0)
pendingOrders.value = ordersStore.orders.filter(o => o.status === 'PENDING').length
</script>

<template>
  <div class="admin-dashboard">
    <div class="container">
      <h1 class="page-title">Admin Dashboard</h1>

      <div v-if="loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>

      <div v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon products">📦</div>
            <div class="stat-content">
              <h3>{{ productsStore.products.length }}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orders">🛒</div>
            <div class="stat-content">
              <h3>{{ ordersStore.orders.length }}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon users">👥</div>
            <div class="stat-content">
              <h3>{{ usersStore.users.length }}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue">💰</div>
            <div class="stat-content">
              <h3>${{ totalRevenue.toFixed(2) }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button @click="router.push('/admin/products')" class="action-btn">
              <span class="action-icon">📦</span>
              <span>Manage Products</span>
            </button>

            <button @click="router.push('/admin/orders')" class="action-btn">
              <span class="action-icon">🛒</span>
              <span>Manage Orders</span>
              <span v-if="pendingOrders > 0" class="badge">{{ pendingOrders }}</span>
            </button>

            <button @click="router.push('/admin/users')" class="action-btn">
              <span class="action-icon">👥</span>
              <span>Manage Users</span>
            </button>
          </div>
        </div>

        <div class="recent-orders">
          <h2>Recent Orders</h2>
          <div v-if="ordersStore.orders.length === 0" class="no-data">
            <p>No orders yet</p>
          </div>
          <div v-else class="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in ordersStore.orders.slice(0, 5)" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.user?.username || 'Unknown' }}</td>
                  <td>${{ order.totalAmount.toFixed(2) }}</td>
                  <td>
                    <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
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
  margin: 0 0 32px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.stat-icon.products {
  background: #DBEAFE;
}

.stat-icon.orders {
  background: #D1FAE5;
}

.stat-icon.users {
  background: #E0E7FF;
}

.stat-icon.revenue {
  background: #FEF3C7;
}

.stat-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.quick-actions,
.recent-orders {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.quick-actions h2,
.recent-orders h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  position: relative;
  padding: 20px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.action-btn:hover {
  background: #374151;
  color: white;
  border-color: #374151;
}

.action-icon {
  font-size: 32px;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #EF4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
}

.orders-table {
  overflow-x: auto;
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
  padding: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
}

td {
  padding: 16px 12px;
  border-bottom: 1px solid #F3F4F6;
  font-size: 14px;
  color: #111827;
}

tr:last-child td {
  border-bottom: none;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-processing {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-shipped {
  background: #E0E7FF;
  color: #4338CA;
}

.status-delivered {
  background: #D1FAE5;
  color: #065F46;
}

.status-cancelled {
  background: #FEE2E2;
  color: #991B1B;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6B7280;
}

.loading {
  text-align: center;
  padding: 80px 20px;
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .orders-table {
    font-size: 12px;
  }

  th,
  td {
    padding: 8px;
  }
}
</style>
