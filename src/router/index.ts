import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

function possuiUsuarioAutenticado() {
  if (typeof localStorage === 'undefined') {
    return false
  }

  const currentUser = localStorage.getItem('currentUser')
  return !!currentUser
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    redirect: '/tabs/home',
  },
  {
    path: '/album',
    redirect: '/tabs/album',
  },
  {
    path: '/profile',
    redirect: '/tabs/profile',
  },
  {
    path: '/login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/reset',
    component: () => import('../views/ResetPasswordView.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/tabs',
    component: () => import('../views/TabsPage.vue'),
    children: [
      {
        path: "",
        redirect: "/tabs/album"
      },
      {
        path: 'album',
        component: () => import('../views/AlbumPage.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/ProfilePage.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const autenticado = possuiUsuarioAutenticado()
  const rotaPublica = ['/login', '/register', '/reset']

  if (to.path.startsWith('/tabs') && !autenticado) {
    return '/login'
  }

  if (rotaPublica.includes(to.path) && autenticado) {
    return '/tabs/home'
  }

  return true
})

export default router
