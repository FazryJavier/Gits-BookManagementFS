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

    <div class="mb-4 flex justify-between items-center">
      <input
        v-model="search"
        @keyup.enter="fetchAuthors"
        type="text"
        placeholder="Search..."
        class="border border-gray-300 rounded px-3 py-2 w-1/3"
      />
      <button @click="fetchAuthors" class="btn bg-blue-500 hover:bg-blue-600">
        Search
      </button>
    </div>

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
  </div>

  <div class="flex justify-center items-center mt-6 space-x-4">
      <button
        @click="changePage(meta.current_page - 1)"
        :disabled="meta.current_page === 1"
        class="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
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
          <option v-for="n in [2, 5, 10]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>

      <span class="text-sm">
        Page {{ meta.current_page }} of {{ meta.last_page }}
      </span>

      <button
        @click="changePage(meta.current_page + 1)"
        :disabled="meta.current_page === meta.last_page"
        class="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authors = ref<any[]>([])
    const meta = ref({
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 2,
    })
    const page = ref(1)
    const perPage = ref(2)
    const search = ref('')
    const auth = useAuthStore()
    const router = useRouter()

    const fetchAuthors = async () => {
      try {
        const res = await api.get('/authors', {
          params: {
            page: page.value,
            perPage: perPage.value,
            search: search.value,
          },
        })
        authors.value = res.data.data.data
        meta.value = res.data.data.meta
      } catch (e) {
        console.error('Error fetching authors', e)
      }
    }

    const changePage = (newPage: number) => {
      if (newPage >= 1 && newPage <= meta.value.last_page) {
        page.value = newPage
        fetchAuthors()
      }
    }

    const handlePerPageChange = () => {
      page.value = 1
      fetchAuthors()
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
        authors.value = authors.value.filter((a) => a.id !== id)
      } catch (e) {
        console.error('Failed to delete author', e)
      }
    }

    onMounted(fetchAuthors)

    return {
      authors,
      meta,
      page,
      perPage,
      search,
      logout,
      goToPublishers,
      goToBooks,
      goToCreate,
      goToEdit,
      deleteAuthor,
      changePage,
      handlePerPageChange,
      fetchAuthors,
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
