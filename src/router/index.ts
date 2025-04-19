import DefaultLayout from "@/layout/DefaultLayout.vue";
import Home from "@/components/Home.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '',  name: `home__en`, component: Home },
    ],
  }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router

