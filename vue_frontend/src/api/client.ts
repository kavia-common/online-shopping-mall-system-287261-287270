import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  User,
  Product,
  Cart,
  Order,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiError
} from '@/types'

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      message: (error.response?.data?.message) || error.message || 'An error occurred',
      status: error.response?.status
    }
    
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(apiError)
  }
)

// PUBLIC_INTERFACE
/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Login user with credentials
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/register', userData)
    return response.data
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/users/logout')
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  }
}

// PUBLIC_INTERFACE
/**
 * Products API methods
 */
export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products')
    return response.data
  },

  /**
   * Get product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  /**
   * Create new product (admin only)
   */
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', product)
    return response.data
  },

  /**
   * Update product (admin only)
   */
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product)
    return response.data
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  }
}

// PUBLIC_INTERFACE
/**
 * Cart API methods
 */
export const cartApi = {
  /**
   * Get user's cart
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/carts/me')
    return response.data
  },

  /**
   * Add item to cart
   */
  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/carts/items', { productId, quantity })
    return response.data
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/carts/items/${itemId}`, { quantity })
    return response.data
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/carts/items/${itemId}`)
    return response.data
  },

  /**
   * Clear cart
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/carts/me')
  }
}

// PUBLIC_INTERFACE
/**
 * Orders API methods
 */
export const ordersApi = {
  /**
   * Create order from cart
   */
  createOrder: async (shippingAddress: string): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', { shippingAddress })
    return response.data
  },

  /**
   * Get user's order history
   */
  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/me')
    return response.data
  },

  /**
   * Get order by ID
   */
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  /**
   * Get all orders (admin only)
   */
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/admin/orders')
    return response.data
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await apiClient.put<Order>(`/admin/orders/${id}/status`, { status })
    return response.data
  }
}

// PUBLIC_INTERFACE
/**
 * Users API methods (admin only)
 */
export const usersApi = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/admin/users')
    return response.data
  },

  /**
   * Get user by ID
   */
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`)
    return response.data
  },

  /**
   * Update user
   */
  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}`, userData)
    return response.data
  },

  /**
   * Delete user
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`)
  }
}

export default apiClient
