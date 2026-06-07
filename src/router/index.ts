import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/reset',
    name: 'ResetPassword',
    component: () => import('../views/ResetPage.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('../views/AlbumPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/album'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, obterUsuarioAtual } = useAuth()

  if (to.meta.requiresAuth) {
    obterUsuarioAtual()
    if (isAuthenticated.value) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
