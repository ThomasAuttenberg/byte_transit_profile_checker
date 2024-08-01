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
      path: '/:uuid',
      component: Main,
    }
  ]
})

export default router
