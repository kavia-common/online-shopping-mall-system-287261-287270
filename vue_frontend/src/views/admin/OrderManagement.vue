<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import type { Order } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const selectedStatus = ref<string>('all')
const searchQuery = ref('')

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  try {
    await ordersStore.fetchAllOrders()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
})

const filteredOrders = ref<Order[]>([])
filteredOrders.value = ordersStore.orders.filter(order => {
  const matchesStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value
  const matchesSearch =
    !searchQuery.value ||
    order.id.toString().includes(searchQuery.value) ||
    order.user?.username.toLowerCase().includes(searchQuery.value.toLowerCase())

  return matchesStatus && matchesSearch
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: 'status-pending',
    PROCESSING: 'status-processing',
    SHIPPED: 'status-shipped',
    DELIVERED: 'status-delivered',
    CANCELLED: 'status-cancelled'
  }
  return statusMap[status] || ''
}

const updateStatus = async (orderId: number, newStatus: Order['status']) => {
  try {
    await ordersStore.updateOrderStatus(orderId, newStatus)
  } catch (error) {
    const err = error as { message?: string }
    alert(err.message || 'Failed to update order status')
  }
}

const statusOptions: Order['status'][] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
]
</script>

<template>
  <div class="order-management">
    <div class="container">
      <h1 class="page-title">Order Management</h1>

      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by order ID or customer..."
          class="search-input"
        />

        <select v-model="selectedStatus" class="status-filter">
          <option value="all">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div v-if="ordersStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading orders...</p>
      </div>

      <div v-else-if="ordersStore.error" class="error">
        <p>{{ ordersStore.error }}</p>
        <button @click="ordersStore.fetchAllOrders()" class="retry-btn">Retry</button>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="no-orders">
        <p>No orders found</p>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{ order.id }}</h3>
              <p class="customer-name">Customer: {{ order.user?.username || 'Unknown' }}</p>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="status-section">
              <select
                :value="order.status"
                @change="(e) => updateStatus(order.id, (e.target as HTMLSelectElement).value as Order['status'])"
                :class="['status-select', getStatusClass(order.status)]"
              >
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span class="item-name">{{ item.product?.name }}</span>
              <span class="item-quantity">× {{ item.quantity }}</span>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="shipping-info">
              <strong>Shipping Address:</strong>
              <p>{{ order.shippingAddress }}</p>
            </div>
            <div class="order-total">
              <span>Total:</span>
              <span class="total-amount">${{ order.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-management {
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

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #374151;
}

.status-filter {
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  min-width: 180px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.order-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.customer-name {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.order-date {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.status-select {
  padding: 8px 12px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.status-select.status-pending {
  background: #FEF3C7;
  color: #92400E;
  border-color: #FDE68A;
}

.status-select.status-processing {
  background: #DBEAFE;
  color: #1E40AF;
  border-color: #BFDBFE;
}

.status-select.status-shipped {
  background: #E0E7FF;
  color: #4338CA;
  border-color: #C7D2FE;
}

.status-select.status-delivered {
  background: #D1FAE5;
  color: #065F46;
  border-color: #A7F3D0;
}

.status-select.status-cancelled {
  background: #FEE2E2;
  color: #991B1B;
  border-color: #FECACA;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 6px;
}

.item-name {
  flex: 1;
  font-weight: 500;
  color: #111827;
}

.item-quantity {
  color: #6B7280;
  margin: 0 12px;
}

.item-price {
  font-weight: 600;
  color: #374151;
  min-width: 80px;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.shipping-info {
  flex: 1;
}

.shipping-info strong {
  font-size: 14px;
  color: #374151;
}

.shipping-info p {
  font-size: 14px;
  color: #6B7280;
  margin: 4px 0 0 0;
}

.order-total {
  text-align: right;
}

.order-total > span:first-child {
  font-size: 14px;
  color: #6B7280;
  display: block;
  margin-bottom: 4px;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
}

.no-orders {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  color: #6B7280;
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
  .filters {
    flex-direction: column;
  }

  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .order-total {
    text-align: left;
    width: 100%;
  }
}
</style>
