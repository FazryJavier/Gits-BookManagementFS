<script setup lang="ts">
import Sidebar from '@/components/layouts/Sidebar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))
</script>

<template>
  <div v-if="!isAuthPage" class="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 p-6">
      <router-view />
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen bg-gray-100">
    <router-view />
  </div>
</template>
