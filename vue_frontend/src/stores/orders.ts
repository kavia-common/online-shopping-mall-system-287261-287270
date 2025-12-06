import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ordersApi } from '@/api/client'
import type { Order } from '@/types'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // PUBLIC_INTERFACE
  /**
   * Create order from cart
   */
  async function createOrder(shippingAddress: string) {
    loading.value = true
    error.value = null
    
    try {
      const order = await ordersApi.createOrder(shippingAddress)
      orders.value.unshift(order)
      return order
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to create order'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch user's order history
   */
  async function fetchUserOrders() {
    loading.value = true
    error.value = null
    
    try {
      orders.value = await ordersApi.getUserOrders()
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch orders'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch order by ID
   */
  async function fetchOrderById(id: number) {
    loading.value = true
    error.value = null
    
    try {
      currentOrder.value = await ordersApi.getById(id)
      return currentOrder.value
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch order'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch all orders (admin only)
   */
  async function fetchAllOrders() {
    loading.value = true
    error.value = null
    
    try {
      orders.value = await ordersApi.getAllOrders()
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch orders'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update order status (admin only)
   */
  async function updateOrderStatus(id: number, status: Order['status']) {
    loading.value = true
    error.value = null
    
    try {
      const updatedOrder = await ordersApi.updateStatus(id, status)
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder
      }
      return updatedOrder
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update order status'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    createOrder,
    fetchUserOrders,
    fetchOrderById,
    fetchAllOrders,
    updateOrderStatus
  }
})
