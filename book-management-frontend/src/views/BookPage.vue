<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const books = ref<any[]>([])
const meta = ref({
  current_page: 1,
  per_page: 2,
  total: 0,
  last_page: 1,
})
const page = ref(1)
const perPage = ref(2)
const search = ref('')

const fetchBooks = async () => {
  try {
    const res = await api.get('/books', {
      params: {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      },
    })

    books.value = res.data.data.data
    meta.value = res.data.data.meta
  } catch (e) {
    console.error('Error fetching books', e)
  }
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= meta.value.last_page) {
    page.value = newPage
    fetchBooks()
  }
}

const handlePerPageChange = () => {
  page.value = 1
  fetchBooks()
}

const goToCreate = () => router.push('/books/create')
const goToEdit = (id: number) => router.push(`/books/edit/${id}`)

const deleteBooks = async (id: number) => {
  if (!confirm('Are you sure to delete this books?')) return
  try {
    await api.delete(`/books/${id}`)
    books.value = books.value.filter((a) => a.id !== id)
  } catch (e) {
    console.error('Failed to delete books', e)
  }
}

onMounted(fetchBooks)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Books List</h1>
      <button
        @click="goToCreate"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        + Create Books
      </button>
    </div>

    <!-- Search -->
    <div
      class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center gap-2 w-full max-w-md">
        <input
          v-model="search"
          @keyup.enter="fetchBooks"
          type="text"
          placeholder="Search books..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <button @click="fetchBooks" class="btn-primary">Search</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">ISBN</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Pages</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Author</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Publisher</th>
            <th class="text-center px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-3 text-gray-700">{{ book.id }}</td>
            <td class="px-6 py-3 text-gray-700">{{ book.title }}</td>
            <td class="px-6 py-3 text-gray-700">{{ book.isbn }}</td>
            <td class="px-6 py-3 text-gray-700">{{ book.pages }}</td>
            <td class="px-6 py-3 text-gray-700">{{ book.author?.name }}</td>
            <td class="px-6 py-3 text-gray-700">{{ book.publisher?.name }}</td>
            <td class="px-6 py-3 text-center">
              <button @click="goToEdit(book.id)" class="btn-warning mr-2">Edit</button>
              <button @click="deleteBooks(book.id)" class="btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="books.length === 0" class="text-center py-6 text-gray-500">No books found.</p>
    </div>

    <!-- Pagination -->
    <div
      class="flex justify-center items-center mt-6 space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <button
        @click="changePage(meta.current_page - 1)"
        :disabled="meta.current_page === 1"
        class="btn-secondary disabled:opacity-50"
      >
        Prev
      </button>

      <div class="flex items-center space-x-2">
        <label class="text-sm">Per Page:</label>
        <select
          v-model="perPage"
          @change="handlePerPageChange"
          class="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option v-for="n in [2, 5, 10]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <span class="text-sm text-gray-700">
        Page {{ meta.current_page }} of {{ meta.last_page }}
      </span>

      <button
        @click="changePage(meta.current_page + 1)"
        :disabled="meta.current_page === meta.last_page"
        class="btn-secondary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition;
}
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition;
}
.btn-warning {
  @apply bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition;
}
.btn-danger {
  @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition;
}
</style>
