import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { cartApi } from '@/api/client'
import type { Cart } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => {
    if (!cart.value?.items) return 0
    return cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalAmount = computed(() => cart.value?.totalAmount || 0)

  // PUBLIC_INTERFACE
  /**
   * Fetch user's cart
   */
  async function fetchCart() {
    loading.value = true
    error.value = null
    
    try {
      cart.value = await cartApi.getCart()
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch cart'
      // Don't throw, just set empty cart
      cart.value = null
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Add item to cart
   */
  async function addToCart(productId: number, quantity: number = 1) {
    loading.value = true
    error.value = null
    
    try {
      cart.value = await cartApi.addItem(productId, quantity)
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to add item to cart'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update cart item quantity
   */
  async function updateCartItem(itemId: number, quantity: number) {
    loading.value = true
    error.value = null
    
    try {
      cart.value = await cartApi.updateItem(itemId, quantity)
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update cart item'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Remove item from cart
   */
  async function removeFromCart(itemId: number) {
    loading.value = true
    error.value = null
    
    try {
      cart.value = await cartApi.removeItem(itemId)
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to remove item from cart'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Clear entire cart
   */
  async function clearCart() {
    loading.value = true
    error.value = null
    
    try {
      await cartApi.clearCart()
      cart.value = null
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to clear cart'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    cart,
    loading,
    error,
    itemCount,
    totalAmount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  }
})
