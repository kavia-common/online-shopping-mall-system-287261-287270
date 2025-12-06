import { ref } from 'vue'
import { defineStore } from 'pinia'
import { productsApi } from '@/api/client'
import type { Product } from '@/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // PUBLIC_INTERFACE
  /**
   * Fetch all products from API
   */
  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      products.value = await productsApi.getAll()
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch products'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch single product by ID
   */
  async function fetchProductById(id: number) {
    loading.value = true
    error.value = null
    
    try {
      currentProduct.value = await productsApi.getById(id)
      return currentProduct.value
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch product'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create new product (admin only)
   */
  async function createProduct(product: Omit<Product, 'id'>) {
    loading.value = true
    error.value = null
    
    try {
      const newProduct = await productsApi.create(product)
      products.value.push(newProduct)
      return newProduct
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to create product'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update existing product (admin only)
   */
  async function updateProduct(id: number, product: Partial<Product>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedProduct = await productsApi.update(id, product)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      if (currentProduct.value?.id === id) {
        currentProduct.value = updatedProduct
      }
      return updatedProduct
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update product'
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete product (admin only)
   */
  async function deleteProduct(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await productsApi.delete(id)
      products.value = products.value.filter(p => p.id !== id)
      if (currentProduct.value?.id === id) {
        currentProduct.value = null
      }
    } catch (e) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete product'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
