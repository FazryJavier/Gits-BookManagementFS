<template>
  <div class="container max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h1 class="text-2xl mb-4">{{ isEdit ? 'Edit Book' : 'Create Book' }}</h1>

    <form @submit.prevent="submitForm">
      <input v-model="form.title" placeholder="Book Title" class="input" required />
      <input v-model="form.isbn" placeholder="ISBN" class="input" required />
      <input v-model.number="form.pages" type="number" placeholder="Pages" class="input" required />

      <select v-model.number="form.author_id" class="input" required>
        <option :value="null" disabled>Select Author</option>
        <option v-for="author in authors" :key="author.id" :value="author.id">
          {{ author.name }}
        </option>
      </select>

      <select v-model.number="form.publisher_id" class="input" required>
        <option :value="null" disabled>Select Publisher</option>
        <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">
          {{ publisher.name }}
        </option>
      </select>

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
    const form = ref({
      title: '',
      isbn: '',
      pages: 0,
      author_id: null as number | null,
      publisher_id: null as number | null,
    })
    const authors = ref<any[]>([])
    const publishers = ref<any[]>([])
    const id = route.params.id as string | undefined

    const fetchAuthors = async () => {
      try {
        const res = await api.get('/authors')
        authors.value = res.data.data.data
      } catch (e) {
        console.error('Failed to fetch authors', e)
      }
    }

    const fetchPublishers = async () => {
      try {
        const res = await api.get('/publishers')
        publishers.value = res.data.data.data
      } catch (e) {
        console.error('Failed to fetch publishers', e)
      }
    }

    const fetchBook = async (id: string) => {
      try {
        const res = await api.get(`/books/${id}`)
        const book = res.data.data
        Object.assign(form.value, {
          title: book.title,
          isbn: book.isbn,
          pages: book.pages || 0,
          author_id: book.author?.id || null,
          publisher_id: book.publisher?.id || null,
        })
      } catch (e) {
        console.error('Failed to fetch book', e)
      }
    }

    onMounted(async () => {
      await fetchAuthors()
      await fetchPublishers()
      if (id) {
        isEdit.value = true
        await fetchBook(id)
      }
    })

    const submitForm = async () => {
      error.value = ''
      success.value = ''
      try {
        if (isEdit.value) {
          await api.put(`/books/${id}`, form.value)
          success.value = 'Book updated successfully!'
        } else {
          await api.post('/books', form.value)
          success.value = 'Book created successfully!'
        }
        router.push('/books')
      } catch (e: any) {
        error.value = e.response?.data?.message || 'Something went wrong'
      }
    }

    const goBack = () => router.push('/books')

    return { form, authors, publishers, isEdit, error, success, submitForm, goBack }
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
