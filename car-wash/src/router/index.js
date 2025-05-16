import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import BookingView from '../views/BookingView.vue'
import CarWashPanelView from '@/views/CarWashPanelView.vue'
import CarWashOrderPanelView from '@/views/CarWashOrderPanelView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: false },
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView,
      meta: { requiresAuth: false },
    },
    {
      path: '/car-wash-panel',
      name: 'car-wash-panel',
      component: CarWashPanelView,
      meta: { requiresAuth: true },
    },
    {
      path: '/car-wash-order-panel',
      name: 'car-wash-order-panel',
      component: CarWashOrderPanelView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('userToken') !== null

  if (!isAuthenticated && to.meta.requiresAuth) {
    // redirect the user to the login page
    return { name: 'login' }
  }
})

export default router
