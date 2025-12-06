<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const quantity = ref(1)
const adding = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

onMounted(async () => {
  const productId = Number(route.params.id)
  if (!isNaN(productId)) {
    try {
      await productsStore.fetchProductById(productId)
    } catch (error) {
      console.error('Failed to load product:', error)
    }
  }
})

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!productsStore.currentProduct) return

  adding.value = true
  try {
    await cartStore.addToCart(productsStore.currentProduct.id, quantity.value)
    toastMessage.value = 'Added to cart!'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (error) {
    const err = error as { message?: string }
    toastMessage.value = err.message || 'Failed to add to cart'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div class="product-detail-page">
    <div class="container">
      <button @click="router.back()" class="back-btn">
        ← Back
      </button>

      <div v-if="productsStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading product...</p>
      </div>

      <div v-else-if="productsStore.error" class="error">
        <p>{{ productsStore.error }}</p>
      </div>

      <div v-else-if="productsStore.currentProduct" class="product-detail">
        <div class="product-image-large">
          <img
            v-if="productsStore.currentProduct.imageUrl"
            :src="productsStore.currentProduct.imageUrl"
            :alt="productsStore.currentProduct.name"
          />
          <div v-else class="placeholder-large">No Image Available</div>
        </div>

        <div class="product-info-section">
          <h1 class="product-title">{{ productsStore.currentProduct.name }}</h1>
          
          <div class="product-meta">
            <span v-if="productsStore.currentProduct.category" class="category-tag">
              {{ productsStore.currentProduct.category }}
            </span>
            <span 
              class="stock-status" 
              :class="{ 'out-of-stock': productsStore.currentProduct.stock === 0 }"
            >
              {{ productsStore.currentProduct.stock > 0 
                ? `${productsStore.currentProduct.stock} in stock` 
                : 'Out of Stock' 
              }}
            </span>
          </div>

          <p class="product-description-full">
            {{ productsStore.currentProduct.description }}
          </p>

          <div class="price-section">
            <span class="price-large">${{ productsStore.currentProduct.price.toFixed(2) }}</span>
          </div>

          <div class="purchase-section">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button 
                  @click="quantity = Math.max(1, quantity - 1)"
                  :disabled="quantity <= 1"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity" 
                  type="number" 
                  min="1" 
                  :max="productsStore.currentProduct.stock"
                />
                <button 
                  @click="quantity = Math.min(productsStore.currentProduct.stock, quantity + 1)"
                  :disabled="quantity >= productsStore.currentProduct.stock"
                >
                  +
                </button>
              </div>
            </div>

            <button
              @click="addToCart"
              class="add-to-cart-large"
              :disabled="adding || productsStore.currentProduct.stock === 0"
            >
              <span v-if="adding" class="spinner"></span>
              <span v-else>
                {{ productsStore.currentProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 24px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #E5E7EB;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-top: 24px;
}

.product-image-large {
  width: 100%;
  height: 500px;
  background: #F9FAFB;
  border-radius: 12px;
  overflow: hidden;
}

.product-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  font-size: 18px;
}

.product-info-section {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.product-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.category-tag {
  padding: 6px 12px;
  background: #F3F4F6;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.stock-status {
  padding: 6px 12px;
  background: #D1FAE5;
  color: #10B981;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.stock-status.out-of-stock {
  background: #FEE2E2;
  color: #EF4444;
}

.product-description-full {
  font-size: 16px;
  line-height: 1.6;
  color: #6B7280;
  margin-bottom: 32px;
}

.price-section {
  margin-bottom: 32px;
}

.price-large {
  font-size: 40px;
  font-weight: 700;
  color: #374151;
}

.purchase-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.quantity-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid #D1D5DB;
  background: white;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #F3F4F6;
  border-color: #374151;
}

.quantity-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
}

.add-to-cart-large {
  width: 100%;
  padding: 16px;
  background: #374151;
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

.add-to-cart-large:hover:not(:disabled) {
  background: #1F2937;
}

.add-to-cart-large:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
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

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
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

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #374151;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 968px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .product-image-large {
    height: 400px;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .price-large {
    font-size: 32px;
  }
}
</style>
