<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

defineOptions({
  name: 'AppNavbar'
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    cartStore.fetchCart()
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand" @click="router.push('/')">
        <h1>ShopMall</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Products</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <router-link to="/cart" class="nav-link cart-link">
            Cart
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </router-link>
          
          <router-link to="/orders" class="nav-link">Orders</router-link>
          
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="nav-link admin-link"
          >
            Admin
          </router-link>
          
          <div class="user-menu">
            <span class="username">{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </div>
        </template>
        
        <template v-else>
          <router-link to="/login" class="nav-link login-link">Login</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  cursor: pointer;
}

.nav-brand h1 {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #374151;
}

.nav-link.router-link-active {
  color: #374151;
  font-weight: 600;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background: #EF4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.admin-link {
  color: #10B981;
}

.admin-link:hover,
.admin-link.router-link-active {
  color: #059669;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  border-left: 1px solid #E5E7EB;
}

.username {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.logout-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #E5E7EB;
}

.login-link {
  padding: 8px 16px;
  background: #374151;
  color: white;
  border-radius: 6px;
  font-weight: 600;
}

.login-link:hover {
  background: #1F2937;
  color: white;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 16px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  
  .user-menu {
    padding-left: 0;
    border-left: none;
  }
  
  .username {
    display: none;
  }
}
</style>
