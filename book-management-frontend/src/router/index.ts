import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Register from '../views/RegisterPage.vue'
import Login from '../views/LoginPage.vue'
import Authors from '../views/AuthorPage.vue'
import Publishers from '../views/PublisherPage.vue'
import Books from '../views/BookPage.vue'

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/authors', component: Authors },
  { path: '/publishers', component: Publishers },
  { path: '/books', component: Books },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore() // ini aman karena dijalankan saat router navigasi
  const publicPages = ['/login', '/register']

  if (!publicPages.includes(to.path) && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
