<template>
  <div class="container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl">Book List</h1>
      <div class="space-x-2">
        <button @click="goToAuthors" class="btn">Authors</button>
        <button @click="goToPublishers" class="btn">Publishers</button>
        <button @click="goToCreate" class="btn bg-green-500 hover:bg-green-600">Create Book</button>
        <button @click="logout" class="btn bg-red-500 hover:bg-red-600">Logout</button>
      </div>
    </div>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Title</th>
          <th class="border px-4 py-2">ISBN</th>
          <th class="border px-4 py-2">Pages</th>
          <th class="border px-4 py-2">Author</th>
          <th class="border px-4 py-2">Publisher</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td class="border px-4 py-2">{{ book.id }}</td>
          <td class="border px-4 py-2">{{ book.title }}</td>
          <td class="border px-4 py-2">{{ book.isbn }}</td>
          <td class="border px-4 py-2">{{ book.pages }}</td>
          <td class="border px-4 py-2">{{ book.author?.name }}</td>
          <td class="border px-4 py-2">{{ book.publisher?.name }}</td>
          <td class="border px-4 py-2 space-x-2">
            <button @click="editBook(book.id)" class="btn bg-yellow-500 hover:bg-yellow-600">
              Edit
            </button>
            <button @click="deleteBook(book.id)" class="btn bg-red-500 hover:bg-red-600">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="books.length === 0" class="mt-4 text-gray-500">No books found.</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/axios'

export default {
  setup() {
    const books = ref<any[]>([])
    const router = useRouter()
    const auth = useAuthStore()

    const fetchBooks = async () => {
      try {
        const res = await api.get('/books')
        books.value = res.data.data.data
      } catch (e) {
        console.error('Error fetching books', e)
      }
    }

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    const goToAuthors = () => router.push('/authors')
    const goToPublishers = () => router.push('/publishers')
    const goToCreate = () => router.push('/books/create')
    const editBook = (id: number) => router.push(`/books/${id}/edit`)

    const deleteBook = async (id: number) => {
      if (!confirm('Are you sure you want to delete this book?')) return
      try {
        await api.delete(`/books/${id}`)
        books.value = books.value.filter((b) => b.id !== id)
      } catch (e) {
        console.error('Failed to delete book', e)
      }
    }

    onMounted(fetchBooks)

    return { books, logout, goToAuthors, goToPublishers, goToCreate, editBook, deleteBook }
  },
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}
.btn {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.btn:hover {
  background-color: #2563eb;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}
th,
td {
  border: 1px solid #d1d5db;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f3f4f6;
}
</style>
