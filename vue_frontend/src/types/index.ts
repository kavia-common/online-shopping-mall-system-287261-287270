// Type definitions for the shopping mall application

export interface User {
  id: number
  username: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  stock: number
  category?: string
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: number
  productId: number
  product?: Product
  quantity: number
  price: number
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  totalAmount: number
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id: number
  productId: number
  product?: Product
  quantity: number
  price: number
}

export interface Order {
  id: number
  userId: number
  user?: User
  items: OrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: string
  createdAt: string
  updatedAt?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  status?: number
}
