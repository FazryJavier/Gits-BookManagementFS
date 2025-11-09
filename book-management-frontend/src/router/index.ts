import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Register from '../views/RegisterPage.vue'
import Login from '../views/LoginPage.vue'
import Authors from '../views/AuthorPage.vue'
import AuthorFormPage from '../views/AuthorFormPage.vue'
import Publishers from '../views/PublisherPage.vue'
import PublisherFormPage from '../views/PublisherFormPage.vue'
import Books from '../views/BookPage.vue'
import BookFormPage from '../views/BookFormPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/authors', component: Authors },
  { path: '/authors/create', component: AuthorFormPage },
  { path: '/authors/edit/:id', component: AuthorFormPage },
  { path: '/publishers', component: Publishers },
  { path: '/publishers/create', component: PublisherFormPage },
  { path: '/publishers/edit/:id', component: PublisherFormPage },
  { path: '/books', component: Books },
  { path: '/books/create', component: BookFormPage },
  { path: '/books/edit/:id', component: BookFormPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const publicPages = ['/login', '/register']

  if (!publicPages.includes(to.path) && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
