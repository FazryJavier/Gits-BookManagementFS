<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const publishers = ref<any[]>([])
const meta = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 2,
})
const page = ref(1)
const perPage = ref(2)
const search = ref('')

const fetchPublishers = async () => {
  try {
    const res = await api.get('/publishers', {
      params: {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      },
    })
    publishers.value = res.data.data.data
    meta.value = res.data.data.meta
  } catch (e) {
    console.error('Error fetching publishers', e)
  }
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= meta.value.last_page) {
    page.value = newPage
    fetchPublishers()
  }
}

const handlePerPageChange = () => {
  page.value = 1
  fetchPublishers()
}

const goToCreate = () => router.push('/publishers/create')
const goToEdit = (id: number) => router.push(`/publishers/edit/${id}`)

const deletePublisher = async (id: number) => {
  if (!confirm('Are you sure to delete this publisher?')) return
  try {
    await api.delete(`/publishers/${id}`)
    publishers.value = publishers.value.filter((p) => p.id !== id)
  } catch (e) {
    console.error('Failed to delete publisher', e)
  }
}

onMounted(fetchPublishers)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Publisher List</h1>
      <button
        @click="goToCreate"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        + Create Publisher
      </button>
    </div>

    <!-- Search -->
    <div
      class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center gap-2 w-full max-w-md">
        <input
          v-model="search"
          @keyup.enter="fetchPublishers"
          type="text"
          placeholder="Search authors..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <button @click="fetchPublishers" class="btn-primary">Search</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Address</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Phone</th>
            <th class="text-center px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="publisher in publishers"
            :key="publisher.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 text-gray-700">{{ publisher.id }}</td>
            <td class="px-6 py-3 text-gray-700">{{ publisher.name }}</td>
            <td class="px-6 py-3 text-gray-700">{{ publisher.address }}</td>
            <td class="px-6 py-3 text-gray-700">{{ publisher.email }}</td>
            <td class="px-6 py-3 text-gray-700">{{ publisher.phone }}</td>
            <td class="px-6 py-3 text-center">
              <button @click="goToEdit(publisher.id)" class="btn-warning mr-2">Edit</button>
              <button @click="deletePublisher(publisher.id)" class="btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="publishers.length === 0" class="text-center py-6 text-gray-500">
        No publishers found.
      </p>
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
