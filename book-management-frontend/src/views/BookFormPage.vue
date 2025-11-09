<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const route = useRoute()
const isEdit = computed(() => !!route.params.id)
const form = ref({
  title: '',
  isbn: '',
  pages: 0,
  author_id: null as number | null,
  publisher_id: null as number | null,
})

const authors = ref<any[]>([])
const publishers = ref<any[]>([])

const loading = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const fetchAuthors = async () => {
  try {
    const res = await api.get('/authors')
    authors.value = res.data.data.data
  } catch (err) {
    console.error('Failed to fetch authors:', err)
  }
}

const fetchPublishers = async () => {
  try {
    const res = await api.get('/publishers')
    publishers.value = res.data.data.data
  } catch (err) {
    console.error('Failed to fetch publishers:', err)
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
  } catch (err) {
    console.error('Failed to fetch book:', err)
  }
}

const submitForm = async () => {
  message.value = null
  loading.value = true
  try {
    if (isEdit.value) {
      await api.put(`/books/${route.params.id}`, form.value)
      message.value = { type: 'success', text: 'Book updated successfully.' }
    } else {
      await api.post('/books', form.value)
      message.value = { type: 'success', text: 'Book created successfully.' }
    }

    setTimeout(() => router.push('/books'), 800)
  } catch (err: any) {
    message.value = {
      type: 'error',
      text: err.response?.data?.message || 'Something went wrong.',
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAuthors()
  await fetchPublishers()
  if (isEdit.value) await fetchBook(route.params.id as string)
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">
        {{ isEdit ? 'Edit Book' : 'Create Book' }}
      </h1>

      <div class="space-x-2">
        <button
          @click="router.push('/books')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back
        </button>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow border border-gray-200 p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter book title"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input
            v-model="form.isbn"
            type="text"
            placeholder="Enter ISBN"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pages</label>
          <input
            v-model.number="form.pages"
            type="number"
            min="1"
            placeholder="Number of pages"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <select
            v-model.number="form.author_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option :value="null" disabled>Select Author</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
          <select
            v-model.number="form.publisher_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option :value="null" disabled>Select Publisher</option>
            <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">
              {{ publisher.name }}
            </option>
          </select>
        </div>
      </div>

      <p
        v-if="message"
        :class="[
          'mt-6 text-center font-medium',
          message.type === 'success' ? 'text-green-600' : 'text-red-600',
        ]"
      >
        {{ message.text }}
      </p>
    </div>
  </div>
</template>
