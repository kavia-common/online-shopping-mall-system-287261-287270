<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegisterMode = ref(false)
const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const errors = ref<{ [key: string]: string }>({})
const submitting = ref(false)

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errors.value = {}
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username is required'
  } else if (formData.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  }

  if (isRegisterMode.value) {
    if (!formData.value.email.trim()) {
      errors.value.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      errors.value.email = 'Invalid email format'
    }
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (isRegisterMode.value) {
    if (formData.value.password !== formData.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    if (isRegisterMode.value) {
      await authStore.register({
        username: formData.value.username,
        email: formData.value.email,
        password: formData.value.password
      })
    } else {
      await authStore.login({
        username: formData.value.username,
        password: formData.value.password
      })
    }

    router.push('/')
  } catch (error) {
    const err = error as { message?: string }
    errors.value.submit = err.message || `${isRegisterMode.value ? 'Registration' : 'Login'} failed`
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">{{ isRegisterMode ? 'Create Account' : 'Welcome Back' }}</h1>
        <p class="login-subtitle">
          {{ isRegisterMode ? 'Sign up to start shopping' : 'Sign in to your account' }}
        </p>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username">Username *</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="Enter your username"
              :class="{ error: errors.username }"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div v-if="isRegisterMode" class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password *</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              :class="{ error: errors.password }"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div v-if="isRegisterMode" class="form-group">
            <label for="confirm-password">Confirm Password *</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              :class="{ error: errors.confirmPassword }"
            />
            <span v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </span>
          </div>

          <div v-if="errors.submit" class="submit-error">
            {{ errors.submit }}
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            <span v-else>{{ isRegisterMode ? 'Sign Up' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="toggle-mode">
          <p>
            {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="toggleMode" class="toggle-btn">
              {{ isRegisterMode ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFFFFF, #F9FAFB);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 48px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  text-align: center;
}

.login-subtitle {
  font-size: 15px;
  color: #6B7280;
  margin: 0 0 32px 0;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-group input {
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #374151;
}

.form-group input.error {
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
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
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
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.toggle-mode {
  margin-top: 24px;
  text-align: center;
}

.toggle-mode p {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  text-decoration: underline;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: #1F2937;
}

@media (max-width: 576px) {
  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
