import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/Signin.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/websites',
      name: 'websites',
      component: () => import('../views/Websites.vue')
    },
    {
      path: '/websites/data/:id',
      name: 'data',
      component: () => import('../views/Data.vue')
    },
    {
      path: '/websites/:id',
      name: 'website',
      component: () => import('../views/Website.vue')
    },
    {
      path: '/edit',
      name: 'add',
      component: () => import('../views/Edit.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue')
    }
  ]
})

export default router