import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Customer views
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import LoginView from '@/views/LoginView.vue'
import OrderHistory from '@/views/OrderHistory.vue'

// Admin views
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ProductManagement from '@/views/admin/ProductManagement.vue'
import OrderManagement from '@/views/admin/OrderManagement.vue'
import UserManagement from '@/views/admin/UserManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductCatalog,
      meta: { title: 'Products' }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetail,
      meta: { title: 'Product Details' }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true, title: 'Shopping Cart' }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresAuth: true, title: 'Checkout' }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderHistory,
      meta: { requiresAuth: true, title: 'Order History' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Dashboard' }
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: ProductManagement,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Manage Products' }
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: OrderManagement,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Manage Orders' }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: UserManagement,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Manage Users' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - ShopMall` : 'ShopMall'

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  // Redirect to home if already logged in and trying to access login page
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
