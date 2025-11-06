<template>
  <div class="container">
    <div class="card">
      <h1 class="text-2xl mb-4">Login</h1>
      <form @submit.prevent="submitForm">
        <input v-model="form.email" placeholder="Email" type="email" class="input" />
        <input v-model="form.password" placeholder="Password" type="password" class="input" />
        <button type="submit" class="btn">Login</button>
      </form>
      <p v-if="error" class="message text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'

export default {
  setup() {
    const form = ref({ email: '', password: '' })
    const error = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const submitForm = async () => {
      error.value = ''
      try {
        const res = await api.post('/login', form.value)
        // Simpan token di Pinia + localStorage
        authStore.setToken(res.data.data.token)
        // Redirect ke Author page
        router.push('/authors')
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Login failed'
      }
    }

    return { form, error, submitForm }
  },
}
</script>

<style scoped>
/* Gunakan CSS yang sama dengan register */
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;
}

.input:focus {
  border-color: #3b82f6;
}

.btn {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 10px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn:hover {
  background-color: #2563eb;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9fafb;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  text-align: center;
  font-size: 0.9rem;
}
</style>
