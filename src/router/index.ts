import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/components/MainComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
    },
    {
      path: '/:criteria/:query',
      name: 'search',
      component: Main,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: Main,
    }
  ]
})

export default router
