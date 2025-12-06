<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await ordersStore.fetchUserOrders()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

const sortedOrders = computed(() => {
  return [...ordersStore.orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">Order History</h1>

      <div v-if="ordersStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading orders...</p>
      </div>

      <div v-else-if="ordersStore.error" class="error">
        <p>{{ ordersStore.error }}</p>
        <button @click="ordersStore.fetchUserOrders()" class="retry-btn">Retry</button>
      </div>

      <div v-else-if="sortedOrders.length === 0" class="no-orders">
        <div class="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here</p>
        <button @click="router.push('/')" class="browse-btn">Browse Products</button>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in sortedOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{ order.id }}</h3>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div :class="['order-status', getStatusClass(order.status)]">
              {{ order.status }}
            </div>
          </div>

          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
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
.orders-page {
  min-height: 100vh;
  background: #FFFFFF;
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #F9FAFB;
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
  margin: 0 0 4px 0;
}

.order-date {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.order-status {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
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
  background: white;
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
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.no-orders h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.no-orders p {
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 32px 0;
}

.browse-btn {
  padding: 12px 32px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #1F2937;
}

.loading,
.error {
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
  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .order-total {
    text-align: left;
    width: 100%;
  }

  .item-name {
    font-size: 14px;
  }
}
</style>
