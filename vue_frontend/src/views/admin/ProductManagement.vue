<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const productsStore = useProductsStore()

const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const formData = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: ''
})
const errors = ref<{ [key: string]: string }>({})
const submitting = ref(false)

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  try {
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  }
})

const openCreateModal = () => {
  editingProduct.value = null
  formData.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  }
  errors.value = {}
  showModal.value = true
}

const openEditModal = (product: Product) => {
  editingProduct.value = product
  formData.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category || '',
    imageUrl: product.imageUrl || ''
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Product name is required'
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required'
  }

  if (formData.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
  }

  if (formData.value.stock < 0) {
    errors.value.stock = 'Stock cannot be negative'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    const productData = {
      name: formData.value.name,
      description: formData.value.description,
      price: formData.value.price,
      stock: formData.value.stock,
      category: formData.value.category || undefined,
      imageUrl: formData.value.imageUrl || undefined
    }

    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productData)
    } else {
      await productsStore.createProduct(productData)
    }

    closeModal()
  } catch (error) {
    const err = error as { message?: string }
    errors.value.submit = err.message || 'Failed to save product'
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (product: Product) => {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

  try {
    await productsStore.deleteProduct(product.id)
  } catch (error) {
    const err = error as { message?: string }
    alert(err.message || 'Failed to delete product')
  }
}
</script>

<template>
  <div class="product-management">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Product Management</h1>
        <button @click="openCreateModal" class="create-btn">+ Add Product</button>
      </div>

      <div v-if="productsStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading products...</p>
      </div>

      <div v-else-if="productsStore.error" class="error">
        <p>{{ productsStore.error }}</p>
        <button @click="productsStore.fetchProducts()" class="retry-btn">Retry</button>
      </div>

      <div v-else class="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productsStore.products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category || '-' }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <div class="actions">
                  <button @click="openEditModal(product)" class="edit-btn">Edit</button>
                  <button @click="handleDelete(product)" class="delete-btn">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="name">Product Name *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter product name"
              :class="{ error: errors.name }"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Enter product description"
              :class="{ error: errors.description }"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Price *</label>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                :class="{ error: errors.price }"
              />
              <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
            </div>

            <div class="form-group">
              <label for="stock">Stock *</label>
              <input
                id="stock"
                v-model.number="formData.stock"
                type="number"
                min="0"
                placeholder="0"
                :class="{ error: errors.stock }"
              />
              <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <input
              id="category"
              v-model="formData.category"
              type="text"
              placeholder="Enter category (optional)"
            />
          </div>

          <div class="form-group">
            <label for="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              v-model="formData.imageUrl"
              type="text"
              placeholder="Enter image URL (optional)"
            />
          </div>

          <div v-if="errors.submit" class="submit-error">
            {{ errors.submit }}
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="submitting" class="spinner"></span>
              <span v-else>{{ editingProduct ? 'Update' : 'Create' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-management {
  min-height: 100vh;
  background: #F9FAFB;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.create-btn {
  padding: 12px 24px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #059669;
}

.products-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #F9FAFB;
}

th {
  text-align: left;
  padding: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
}

td {
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
  font-size: 14px;
  color: #111827;
}

tr:last-child td {
  border-bottom: none;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #DBEAFE;
  color: #1E40AF;
}

.edit-btn:hover {
  background: #1E40AF;
  color: white;
}

.delete-btn {
  background: #FEE2E2;
  color: #991B1B;
}

.delete-btn:hover {
  background: #EF4444;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #F3F4F6;
  color: #6B7280;
  border-radius: 6px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #E5E7EB;
  color: #374151;
}

.modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #374151;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #EF4444;
}

.error-message {
  font-size: 13px;
  color: #EF4444;
}

.submit-error {
  padding: 12px;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 8px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #F3F4F6;
  color: #374151;
}

.cancel-btn:hover {
  background: #E5E7EB;
}

.submit-btn {
  background: #374151;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #1F2937;
}

.submit-btn:disabled {
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

.loading,
.error {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
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
  to {
    transform: rotate(360deg);
  }
}

.error p {
  font-size: 16px;
  color: #EF4444;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #1F2937;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .products-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>
