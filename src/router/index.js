import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Demo from '../views/Demo.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Главная' }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo,
    meta: { title: 'Демо' }
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: Profile,
    props: true,
    meta: { title: 'Профиль' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Настройки' },
    children: [
      {
        path: 'general',
        name: 'SettingsGeneral',
        component: () => import('../views/settings/General.vue'),
        meta: { title: 'Общие настройки' }
      },
      {
        path: 'account',
        name: 'SettingsAccount',
        component: () => import('../views/settings/Account.vue'),
        meta: { title: 'Настройки аккаунта' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 - Страница не найдена' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Обновление заголовка страницы
router.beforeEach((to) => {
  document.title = to.meta.title || 'Vue Interactive App'
})

export default router