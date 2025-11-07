<template>
  <div class="container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl">Authors</h1>
      <div class="space-x-2">
        <button @click="goToPublishers" class="btn">Publishers</button>
        <button @click="goToBooks" class="btn">Books</button>
        <button @click="goToCreate" class="btn bg-green-500 hover:bg-green-600">
          Create Author
        </button>
        <button @click="logout" class="btn bg-red-500 hover:bg-red-600">Logout</button>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-3">
      <input
        v-model="search"
        @input="handleSearch"
        type="text"
        placeholder="Search author..."
        class="border rounded px-3 py-2 w-64"
      />
    </div>

    <!-- Table -->
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Age</th>
          <th class="border px-4 py-2">Birth Date</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.id">
          <td class="border px-4 py-2">{{ author.id }}</td>
          <td class="border px-4 py-2">{{ author.name }}</td>
          <td class="border px-4 py-2">{{ author.age }}</td>
          <td class="border px-4 py-2">{{ author.birth_date }}</td>
          <td class="border px-4 py-2">
            <button @click="goToEdit(author.id)" class="btn bg-yellow-500 hover:bg-yellow-600 mr-2">
              Edit
            </button>
            <button @click="deleteAuthor(author.id)" class="btn bg-red-500 hover:bg-red-600">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="authors.length === 0" class="mt-4 text-gray-500">No authors found.</p>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-4 space-x-2">
      <button
        :disabled="!pagination.prev_page_url"
        @click="changePage(pagination.current_page - 1)"
        class="btn"
      >
        Prev
      </button>

      <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

      <button
        :disabled="!pagination.next_page_url"
        @click="changePage(pagination.current_page + 1)"
        class="btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authors = ref<any[]>([])
    const pagination = ref({
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    })
    const search = ref('')
    const auth = useAuthStore()
    const router = useRouter()

    const fetchAuthors = async (page = 1, searchQuery = '') => {
      try {
        const res = await api.get('/authors', {
          params: { page, search: searchQuery },
        })
        authors.value = res.data.data.data
        pagination.value = {
          current_page: res.data.data.current_page,
          last_page: res.data.data.last_page,
          next_page_url: res.data.data.next_page_url,
          prev_page_url: res.data.data.prev_page_url,
        }
      } catch (e) {
        console.error('Error fetching authors', e)
      }
    }

    const handleSearch = () => {
      fetchAuthors(1, search.value)
    }

    const changePage = (page: number) => {
      fetchAuthors(page, search.value)
    }

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    const goToPublishers = () => router.push('/publishers')
    const goToBooks = () => router.push('/books')
    const goToCreate = () => router.push('/authors/create')
    const goToEdit = (id: number) => router.push(`/authors/edit/${id}`)

    const deleteAuthor = async (id: number) => {
      if (!confirm('Are you sure to delete this author?')) return
      try {
        await api.delete(`/authors/${id}`)
        fetchAuthors(pagination.value.current_page, search.value)
      } catch (e) {
        console.error('Failed to delete author', e)
      }
    }

    onMounted(() => fetchAuthors())

    return {
      authors,
      search,
      pagination,
      handleSearch,
      changePage,
      logout,
      goToPublishers,
      goToBooks,
      goToCreate,
      goToEdit,
      deleteAuthor,
    }
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
.btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
