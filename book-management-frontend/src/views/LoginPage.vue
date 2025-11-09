<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const submitForm = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/login', form.value)
    authStore.setToken(res.data.data.token)
    router.push('/authors')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">Book Management</h1>
      <p class="text-gray-500 text-center mb-6">Login to your admin dashboard</p>

      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Processing...</span>
        </button>
      </form>

      <p v-if="error" class="text-center text-red-500 mt-4 text-sm">{{ error }}</p>

      <p class="text-sm text-gray-500 text-center mt-6">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 hover:underline"
          >Register here</router-link
        >
      </p>
    </div>
  </div>
</template>
