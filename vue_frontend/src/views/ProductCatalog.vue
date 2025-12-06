<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()
const searchQuery = ref('')
const selectedCategory = ref('all')

onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  }
})

const categories = computed(() => {
  const cats = new Set<string>()
  productsStore.products.forEach(p => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats)
})

const filteredProducts = computed(() => {
  let products = productsStore.products

  if (selectedCategory.value !== 'all') {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return products
})
</script>

<template>
  <div class="catalog-page">
    <div class="container">
      <div class="page-header">
        <h1>Product Catalog</h1>
        <p>Browse our wide selection of quality products</p>
      </div>

      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />

        <div class="category-filter">
          <button
            @click="selectedCategory = 'all'"
            :class="['category-btn', { active: selectedCategory === 'all' }]"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="['category-btn', { active: selectedCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="productsStore.loading" class="loading">
        <div class="spinner-large"></div>
        <p>Loading products...</p>
      </div>

      <div v-else-if="productsStore.error" class="error">
        <p>{{ productsStore.error }}</p>
        <button @click="productsStore.fetchProducts()" class="retry-btn">
          Retry
        </button>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="no-products">
        <p>No products found</p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

.filters {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #374151;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #E5E7EB;
}

.category-btn.active {
  background: #374151;
  color: white;
  border-color: #374151;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.loading,
.error,
.no-products {
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

.loading p,
.no-products p {
  font-size: 16px;
  color: #6B7280;
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
  .catalog-page {
    padding: 24px 0;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}
</style>
