<script setup lang="ts">
import type { CartItem as CartItemType } from '@/types'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'

const props = defineProps<{
  item: CartItemType
}>()

const cartStore = useCartStore()
const updating = ref(false)

const updateQuantity = async (newQuantity: number) => {
  if (newQuantity < 1) return
  
  updating.value = true
  try {
    await cartStore.updateCartItem(props.item.id, newQuantity)
  } catch (error) {
    console.error('Failed to update quantity:', error)
  } finally {
    updating.value = false
  }
}

const removeItem = async () => {
  updating.value = true
  try {
    await cartStore.removeFromCart(props.item.id)
  } catch (error) {
    console.error('Failed to remove item:', error)
  } finally {
    updating.value = false
  }
}

const itemTotal = () => {
  return (props.item.price * props.item.quantity).toFixed(2)
}
</script>

<template>
  <div class="cart-item">
    <div class="item-image">
      <img 
        v-if="item.product?.imageUrl" 
        :src="item.product.imageUrl" 
        :alt="item.product?.name"
      />
      <div v-else class="placeholder">No Image</div>
    </div>
    
    <div class="item-details">
      <h4 class="item-name">{{ item.product?.name }}</h4>
      <p class="item-price">${{ item.price.toFixed(2) }} each</p>
    </div>
    
    <div class="item-quantity">
      <button 
        class="quantity-btn"
        @click="updateQuantity(item.quantity - 1)"
        :disabled="updating || item.quantity <= 1"
      >
        -
      </button>
      <span class="quantity">{{ item.quantity }}</span>
      <button 
        class="quantity-btn"
        @click="updateQuantity(item.quantity + 1)"
        :disabled="updating"
      >
        +
      </button>
    </div>
    
    <div class="item-total">
      <span class="total-price">${{ itemTotal() }}</span>
    </div>
    
    <button 
      class="remove-btn"
      @click="removeItem"
      :disabled="updating"
      title="Remove item"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #E5E7EB;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9CA3AF;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #D1D5DB;
  background: white;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.quantity-btn:hover:not(:disabled) {
  background: #F3F4F6;
  border-color: #374151;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #111827;
}

.item-total {
  min-width: 80px;
  text-align: right;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #EF4444;
  color: white;
  border-radius: 4px;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover:not(:disabled) {
  background: #DC2626;
}

.remove-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .item-details {
    flex: 1 1 calc(100% - 76px);
  }
  
  .item-quantity {
    flex: 1;
  }
  
  .item-total {
    flex: 1;
    text-align: left;
  }
  
  .remove-btn {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}
</style>
