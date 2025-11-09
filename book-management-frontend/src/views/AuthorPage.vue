<script lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/axios'
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

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Authors</h1>

      <button @click="goToCreate" class="btn-primary">+ Create Author</button>
    </div>

    <div
      class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center gap-2 w-full max-w-md">
        <input
          v-model="search"
          @keyup.enter="fetchAuthors"
          type="text"
          placeholder="Search authors..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <button @click="fetchAuthors" class="btn-primary">Search</button>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Age</th>
            <th class="text-left px-6 py-3 text-sm font-semibold text-gray-600">Birth Date</th>
            <th class="text-center px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authors" :key="author.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-3 text-gray-700">{{ author.id }}</td>
            <td class="px-6 py-3 text-gray-700">{{ author.name }}</td>
            <td class="px-6 py-3 text-gray-700">{{ author.age }}</td>
            <td class="px-6 py-3 text-gray-700">{{ author.birth_date }}</td>
            <td class="px-6 py-3 text-center">
              <button @click="goToEdit(author.id)" class="btn-warning mr-2">Edit</button>
              <button @click="deleteAuthor(author.id)" class="btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="authors.length === 0" class="text-center py-6 text-gray-500">No authors found.</p>
    </div>

    <div
      class="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center gap-3">
        <button
          @click="changePage(meta.current_page - 1)"
          :disabled="meta.current_page === 1"
          class="btn-secondary disabled:opacity-50"
        >
          Prev
        </button>

        <span class="text-gray-600 text-sm">
          Page <span class="font-semibold">{{ meta.current_page }}</span> of {{ meta.last_page }}
        </span>

        <button
          @click="changePage(meta.current_page + 1)"
          :disabled="meta.current_page === meta.last_page"
          class="btn-secondary disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Per Page:</label>
        <select
          v-model="perPage"
          @change="handlePerPageChange"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring focus:ring-blue-200"
        >
          <option v-for="n in [2, 5, 10]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
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
