<template>
  <div class="container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl">Publisher List</h1>
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
          <th class="border px-4 py-2">Address</th>
          <th class="border px-4 py-2">Email</th>
          <th class="border px-4 py-2">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="publisher in publishers" :key="publisher.id">
          <td class="border px-4 py-2">{{ publisher.id }}</td>
          <td class="border px-4 py-2">{{ publisher.name }}</td>
          <td class="border px-4 py-2">{{ publisher.address }}</td>
          <td class="border px-4 py-2">{{ publisher.email }}</td>
          <td class="border px-4 py-2">{{ publisher.phone }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="publishers.length === 0" class="mt-4 text-gray-500">No publishers found.</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const publishers = ref([])
    const auth = useAuthStore()
    const router = useRouter()

    const fetchPublishers = async () => {
      try {
        const res = await api.get('/publishers')
        // Ambil data dari pagination
        publishers.value = res.data.data.data
      } catch (e) {
        console.error('Error fetching publishers', e)
      }
    }

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    const goToAuthors = () => router.push('/authors')
    const goToPublishers = () => router.push('/publishers')
    const goToBooks = () => router.push('/books')

    onMounted(fetchPublishers)

    return { publishers, logout, goToAuthors, goToPublishers, goToBooks }
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
