import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

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
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPage.vue')
  },
  {
    path: '/tabs',
    component: () => import('../views/TabsView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'album',
        name: 'Album',
        component: () => import('../views/AlbumPage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('../views/StatsView.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: (to) => {
      const { obterUsuarioAtual } = useAuth()
      if (obterUsuarioAtual()) {
        return '/tabs/album'
      }
      return '/login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { obterUsuarioAtual } = useAuth()
  
  if (to.meta.requiresAuth) {
    const usuario = obterUsuarioAtual()
    if (usuario) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router