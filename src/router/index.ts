import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPasswordView.vue')
  },
  {
    path: '/tabs',
    name: 'Tabs',
    component: () => import('../views/TabsView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'album'
      },
      {
        path: 'album',
        name: 'Album',
        component: () => import('../views/tabs/AlbumTabView.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('../views/tabs/StatsTabView.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/tabs/ProfileTabView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tabs/album'
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
