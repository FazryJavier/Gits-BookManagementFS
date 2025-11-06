<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Register</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <input v-model="form.name" type="text" placeholder="Name" class="input" required />
      </div>
      <div>
        <input v-model="form.username" type="text" placeholder="Username" class="input" required />
      </div>
      <div>
        <input v-model="form.email" type="email" placeholder="Email" class="input" required />
      </div>
      <div>
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="input"
          required
        />
      </div>

      <button type="submit" class="btn w-full">Register</button>
    </form>

    <p v-if="error" class="mt-4 text-red-500 font-medium">{{ error }}</p>
    <p v-if="success" class="mt-4 text-green-500 font-medium">{{ success }}</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import api from '../api/axios'

export default {
  setup() {
    const form = ref({
      name: '',
      username: '',
      email: '',
      password: '',
    })
    const error = ref('')
    const success = ref('')

    const submitForm = async () => {
      error.value = ''
      success.value = ''
      try {
        const res = await api.post('/register', form.value)
        success.value = 'Registration successful!'
        console.log(res.data)
        // Reset form after success
        form.value = { name: '', username: '', email: '', password: '' }
      } catch (e: any) {
        error.value = e.response?.data?.message || e.response?.data?.error || 'Something went wrong'
      }
    }

    return { form, submitForm, error, success }
  },
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;
}
.input:focus {
  border-color: #3b82f6;
}
.btn {
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
</style>
