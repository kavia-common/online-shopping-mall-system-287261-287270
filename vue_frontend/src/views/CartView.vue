<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import CartItem from '@/components/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  try {
    await cartStore.fetchCart()
  } catch (error) {
    console.error('Failed to load cart:', error)
  }
})

const proceedToCheckout = () => {
  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/')
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>

      <div v-if="cartStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading cart...</p>
      </div>

      <div v-else-if="!cartStore.cart || cartStore.cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <button @click="continueShopping" class="continue-btn">
          Browse Products
        </button>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem
            v-for="item in cartStore.cart.items"
            :key="item.id"
            :item="item"
          />
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          
          <div class="summary-row">
            <span>Subtotal ({{ cartStore.itemCount }} items)</span>
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
          
          <button @click="proceedToCheckout" class="checkout-btn">
            Proceed to Checkout
          </button>
          
          <button @click="continueShopping" class="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

.cart-items {
  display: flex;
  flex-direction: column;
}

.cart-summary {
  background: #F9FAFB;
  padding: 24px;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary h2 {
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

.checkout-btn {
  width: 100%;
  padding: 14px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 20px;
}

.checkout-btn:hover {
  background: #1F2937;
}

.continue-shopping-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;
}

.continue-shopping-btn:hover {
  background: #F3F4F6;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-cart h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-cart p {
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 32px 0;
}

.continue-btn {
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

.continue-btn:hover {
  background: #1F2937;
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
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}
</style>
