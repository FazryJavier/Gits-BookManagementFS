<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const form = ref({
  name: '',
  age: 0,
  birth_date: '',
})
const loading = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const fetchAuthor = async (id: string) => {
  try {
    const res = await api.get(`/authors/${id}`)
    Object.assign(form.value, res.data.data)
  } catch (err) {
    console.error('Failed to fetch author:', err)
  }
}

const submitForm = async () => {
  message.value = null
  loading.value = true
  try {
    if (isEdit.value) {
      await api.put(`/authors/${route.params.id}`, form.value)
      message.value = { type: 'success', text: 'Author updated successfully.' }
    } else {
      await api.post('/authors', form.value)
      message.value = { type: 'success', text: 'Author created successfully.' }
    }

    setTimeout(() => router.push('/authors'), 800)
  } catch (err: any) {
    message.value = {
      type: 'error',
      text: err.response?.data?.message || 'Something went wrong.',
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) await fetchAuthor(route.params.id as string)
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">
        {{ isEdit ? 'Edit Author' : 'Create Author' }}
      </h1>

      <div class="space-x-2">
        <button
          @click="router.push('/authors')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back
        </button>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow border border-gray-200 p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter author name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            v-model.number="form.age"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
          <input
            v-model="form.birth_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <p
        v-if="message"
        :class="[
          'mt-6 text-center font-medium',
          message.type === 'success' ? 'text-green-600' : 'text-red-600',
        ]"
      >
        {{ message.text }}
      </p>
    </div>
  </div>
</template>
