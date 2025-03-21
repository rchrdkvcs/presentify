import { createRouter, createWebHistory } from 'vue-router'
import { loadSlides } from '@/composables/slideLoader'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  // Dynamic route for slides
  {
    path: '/:slug',
    name: 'slide',
    component: () => import('@/views/SlideView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export async function setupSlideRoutes() {
  const slides = await loadSlides()
  return slides
}

export default router
