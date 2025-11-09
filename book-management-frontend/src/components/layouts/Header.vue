<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const userName = computed(() => auth.user?.name || 'Guest')
</script>

<template>
  <header
    class="flex justify-between items-center px-6 py-3 bg-white shadow-md border-b border-gray-200 sticky top-0 z-40"
  >
    <h1 class="text-xl font-semibold text-gray-800">📚 Book Management</h1>

    <div class="flex items-center gap-3">
      <div
        class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
      >
        {{ userName.charAt(0).toUpperCase() }}
      </div>
      <span class="text-gray-700 font-medium">{{ userName }}</span>
    </div>
  </header>
</template>
