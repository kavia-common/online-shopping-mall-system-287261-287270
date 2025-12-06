<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initAuth()
})

const shouldShowNavbar = () => {
  // Hide navbar on login page
  return route.name !== 'login'
}
</script>

<template>
  <div id="app">
    <AppNavbar v-if="shouldShowNavbar()" />
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #FFFFFF;
  color: #111827;
}

#app {
  min-height: 100vh;
}
</style>
