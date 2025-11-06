import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/RegisterPage.vue'
// import Login from '../views/Login.vue'
// import Authors from '../views/Authors.vue'
// import Publishers from '../views/Publishers.vue'
// import Books from '../views/Books.vue'

const routes = [
  { path: '/register', component: Register },
  // { path: '/login', component: Login },
  // { path: '/authors', component: Authors },
  // { path: '/publishers', component: Publishers },
  // { path: '/books', component: Books },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
