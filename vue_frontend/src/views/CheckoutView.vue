<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const shippingAddress = ref('')
const submitting = ref(false)
const errors = ref<{ [key: string]: string }>({})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  try {
    await cartStore.fetchCart()
    if (!cartStore.cart || cartStore.cart.items.length === 0) {
      router.push('/cart')
    }
  } catch (error) {
    console.error('Failed to load cart:', error)
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!shippingAddress.value.trim()) {
    errors.value.shippingAddress = 'Shipping address is required'
  } else if (shippingAddress.value.trim().length < 10) {
    errors.value.shippingAddress = 'Please provide a complete address'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitOrder = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    await ordersStore.createOrder(shippingAddress.value.trim())
    await cartStore.clearCart()
    router.push(`/orders`)
  } catch (error) {
    const err = error as { message?: string }
    errors.value.submit = err.message || 'Failed to place order'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Checkout</h1>

      <div v-if="cartStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading...</p>
      </div>

      <div v-else-if="cartStore.cart && cartStore.cart.items.length > 0" class="checkout-content">
        <div class="checkout-form">
          <section class="form-section">
            <h2>Shipping Information</h2>
            
            <div class="form-group">
              <label for="shipping-address">Shipping Address *</label>
              <textarea
                id="shipping-address"
                v-model="shippingAddress"
                rows="4"
                placeholder="Enter your complete shipping address"
                :class="{ error: errors.shippingAddress }"
              ></textarea>
              <span v-if="errors.shippingAddress" class="error-message">
                {{ errors.shippingAddress }}
              </span>
            </div>
          </section>

          <section class="form-section">
            <h2>Order Items</h2>
            <div class="order-items">
              <div 
                v-for="item in cartStore.cart.items" 
                :key="item.id"
                class="order-item"
              >
                <span class="item-name">{{ item.product?.name }}</span>
                <span class="item-quantity">× {{ item.quantity }}</span>
                <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </section>

          <div v-if="errors.submit" class="submit-error">
            {{ errors.submit }}
          </div>

          <button 
            @click="submitOrder" 
            class="place-order-btn"
            :disabled="submitting"
          >
            <span v-if="submitting" class="spinner"></span>
            <span v-else>Place Order - ${{ cartStore.totalAmount.toFixed(2) }}</span>
          </button>
        </div>

        <div class="order-summary-sidebar">
          <h2>Order Summary</h2>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span class="amount">${{ cartStore.totalAmount.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Shipping</span>
            <span class="amount">FREE</span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span class="amount">${{ cartStore.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
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

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: #F9FAFB;
  padding: 24px;
  border-radius: 12px;
}

.form-section h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group textarea {
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #374151;
}

.form-group textarea.error {
  border-color: #EF4444;
}

.error-message {
  font-size: 13px;
  color: #EF4444;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}

.submit-error {
  padding: 12px;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 8px;
  font-size: 14px;
}

.place-order-btn {
  width: 100%;
  padding: 16px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.place-order-btn:hover:not(:disabled) {
  background: #059669;
}

.place-order-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.order-summary-sidebar {
  background: #F9FAFB;
  padding: 24px;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.order-summary-sidebar h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #6B7280;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-top: 12px;
}

.amount {
  font-weight: 600;
  color: #374151;
}

.summary-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 16px 0;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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
  to { transform: rotate(360deg); }
}

@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary-sidebar {
    position: static;
  }
}
</style>
