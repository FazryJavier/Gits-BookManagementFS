<template>
  <div class="container max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h1 class="text-2xl mb-4">{{ isEdit ? 'Edit Publisher' : 'Create Publisher' }}</h1>

    <form @submit.prevent="submitForm">
      <input v-model="form.name" placeholder="Publisher Name" class="input" required />
      <input v-model="form.address" placeholder="Address" class="input" required />
      <input v-model="form.email" type="email" placeholder="Email" class="input" required />
      <input v-model="form.phone" placeholder="Phone" class="input" required />

      <div class="flex space-x-2 mt-4">
        <button type="submit" class="btn bg-green-500 hover:bg-green-600">
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button type="button" class="btn bg-gray-400 hover:bg-gray-500" @click="goBack">
          Cancel
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/axios'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isEdit = ref(false)
    const error = ref('')
    const success = ref('')
    const form = ref({ name: '', address: '', email: '', phone: '' })
    const id = route.params.id as string | undefined

    const fetchPublisher = async (id: string) => {
      try {
        const res = await api.get(`/publishers/${id}`)
        Object.assign(form.value, res.data.data)
      } catch (e) {
        console.error('Failed to fetch publisher', e)
      }
    }

    const submitForm = async () => {
      error.value = ''
      success.value = ''
      try {
        if (isEdit.value) {
          await api.put(`/publishers/${id}`, form.value)
          success.value = 'Publisher updated successfully'
        } else {
          await api.post('/publishers', form.value)
          success.value = 'Publisher created successfully'
        }
        router.push('/publishers')
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Something went wrong'
      }
    }

    const goBack = () => router.push('/publishers')

    onMounted(async () => {
      if (id) {
        isEdit.value = true
        await fetchPublisher(id)
      }
    })

    return { form, submitForm, error, success, isEdit, goBack }
  },
}
</script>

<style scoped>
.input {
  width: 100%;
  margin-bottom: 8px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
