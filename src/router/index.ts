import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: () => import('@/views/EditorView.vue'),
    props: true,
  },
  {
    path: '/present/:id',
    name: 'Present',
    component: () => import('@/views/PresentationView.vue'),
    props: true,
  },
  {
    path: '/present/:id/speaker',
    name: 'SpeakerView',
    component: () => import('@/views/SpeakerView.vue'),
    props: true,
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('@/views/TemplatesView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
