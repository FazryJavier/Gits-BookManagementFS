<template>
  <div class="container max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h1 class="text-2xl mb-4">{{ isEdit ? 'Edit Author' : 'Create Author' }}</h1>

    <form @submit.prevent="submitForm">
      <input v-model="form.name" placeholder="Name" class="input" />
      <input v-model="form.age" placeholder="Age" type="number" class="input" />
      <input
        v-model="form.birth_date"
        placeholder="Birth Date (YYYY-MM-DD)"
        type="date"
        class="input"
      />
      <button type="submit" class="btn">{{ isEdit ? 'Update' : 'Create' }}</button>
    </form>

    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isEdit = ref(false)
    const error = ref('')
    const success = ref('')
    const form = ref({ name: '', age: 0, birth_date: '' })

    const fetchAuthor = async (id: string) => {
      try {
        const res = await api.get(`/authors/${id}`)
        Object.assign(form.value, res.data.data)
      } catch (e) {
        console.error('Failed to fetch author', e)
      }
    }

    const submitForm = async () => {
      error.value = ''
      success.value = ''
      try {
        if (isEdit.value) {
          await api.put(`/authors/${route.params.id}`, form.value)
          success.value = 'Author updated successfully'
        } else {
          await api.post('/authors', form.value)
          success.value = 'Author created successfully'
        }
        router.push('/authors')
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Something went wrong'
      }
    }

    onMounted(async () => {
      if (route.params.id) {
        isEdit.value = true
        await fetchAuthor(route.params.id as string)
      }
    })

    return { form, submitForm, error, success, isEdit }
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
