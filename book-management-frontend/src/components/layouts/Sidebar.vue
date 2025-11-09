<script setup lang="ts">
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Book, Users, Building2, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    auth.logout()
    router.push('/login')
  }
}

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <aside
    class="w-64 h-screen bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800 shadow-lg"
  >
    <div class="p-6 border-b border-gray-800 flex items-center justify-center">
      <h1 class="text-2xl font-bold text-white tracking-wide">Admin Panel</h1>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink
        to="/authors"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200"
        :class="
          isActive('/authors') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
        "
      >
        <Users class="w-5 h-5" />
        <span>Authors</span>
      </RouterLink>

      <RouterLink
        to="/books"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200"
        :class="
          isActive('/books') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
        "
      >
        <Book class="w-5 h-5" />
        <span>Books</span>
      </RouterLink>

      <RouterLink
        to="/publishers"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200"
        :class="
          isActive('/publishers') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
        "
      >
        <Building2 class="w-5 h-5" />
        <span>Publishers</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-800">
      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
      >
        <LogOut class="w-5 h-5" />
        Logout
      </button>
    </div>
  </aside>
</template>
