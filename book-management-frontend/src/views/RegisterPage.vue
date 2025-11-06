<template>
  <div class="container">
    <div class="card">
      <h1 class="text-2xl mb-4">Register</h1>
      <form @submit.prevent="submitForm">
        <input v-model="form.name" placeholder="Name" class="input" />
        <input v-model="form.username" placeholder="Username" class="input" />
        <input v-model="form.email" placeholder="Email" type="email" class="input" />
        <input v-model="form.password" placeholder="Password" type="password" class="input" />
        <button type="submit" class="btn">Register</button>
      </form>
      <p v-if="error" class="message text-red-500">{{ error }}</p>
      <p v-if="success" class="message text-green-500">{{ success }}</p>
    </div>
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
  width: 80%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;
}
.input:focus {
  border-color: #3b82f6;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
