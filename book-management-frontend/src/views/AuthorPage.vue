<template>
  <div class="container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl">Author List</h1>
      <div class="space-x-2">
        <button @click="goToAuthors" class="btn">Authors</button>
        <button @click="goToPublishers" class="btn">Publishers</button>
        <button @click="goToBooks" class="btn">Books</button>
        <button @click="logout" class="btn bg-red-500 hover:bg-red-600">Logout</button>
      </div>
    </div>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Age</th>
          <th class="border px-4 py-2">Birth Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.id">
          <td class="border px-4 py-2">{{ author.id }}</td>
          <td class="border px-4 py-2">{{ author.name }}</td>
          <td class="border px-4 py-2">{{ author.age }}</td>
          <td class="border px-4 py-2">{{ author.birth_date }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="authors.length === 0" class="mt-4 text-gray-500">No authors found.</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authors = ref([])
    const auth = useAuthStore()
    const router = useRouter()

    const fetchAuthors = async () => {
      try {
        const res = await api.get('/authors')
        authors.value = res.data.data.data
      } catch (e) {
        console.error('Error fetching authors', e)
      }
    }

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    const goToAuthors = () => router.push('/authors')
    const goToPublishers = () => router.push('/publishers')
    const goToBooks = () => router.push('/books')

    onMounted(fetchAuthors)

    return { authors, logout, goToAuthors, goToPublishers, goToBooks }
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
