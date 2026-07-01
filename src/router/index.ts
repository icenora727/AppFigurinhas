import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
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
        redirect: "/tabs/home"
      },
      {
        path: 'home',
        component: () => import('../views/HomePage.vue')
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

export default router
