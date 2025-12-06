<script setup lang="ts">
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const adding = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const showError = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  adding.value = true
  try {
    await cartStore.addToCart(props.product.id, 1)
    toastMessage.value = 'Added to cart!'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
    showError(errorMessage)
  } finally {
    adding.value = false
  }
}

const viewDetails = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<template>
  <div class="product-card">
    <div class="product-image" @click="viewDetails">
      <img 
        v-if="product.imageUrl" 
        :src="product.imageUrl" 
        :alt="product.name"
      />
      <div v-else class="placeholder-image">
        <span>No Image</span>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name" @click="viewDetails">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <span class="product-stock" :class="{ 'out-of-stock': product.stock === 0 }">
          {{ product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock' }}
        </span>
      </div>
      
      <button 
        class="add-to-cart-btn"
        @click="addToCart"
        :disabled="adding || product.stock === 0"
      >
        <span v-if="adding" class="spinner"></span>
        <span v-else>{{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}</span>
      </button>
    </div>

    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<style scoped>
.product-card {
  position: relative;
  background: #F9FAFB;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #E5E7EB;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  font-size: 14px;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  cursor: pointer;
}

.product-name:hover {
  color: #374151;
}

.product-description {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
}

.product-stock {
  font-size: 12px;
  color: #10B981;
  font-weight: 500;
}

.product-stock.out-of-stock {
  color: #EF4444;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #1F2937;
}

.add-to-cart-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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

@media (max-width: 768px) {
  .product-image {
    height: 160px;
  }
  
  .product-name {
    font-size: 16px;
  }
  
  .product-price {
    font-size: 18px;
  }
}
</style>
