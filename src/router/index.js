import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '../utils/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('../views/ArticleView.vue')
    },
    {
      path: '/category/:category',
      name: 'category',
      component: () => import('../views/CategoryView.vue')
    },
    {
      path: '/essay',
      name: 'essay',
      component: () => import('../views/EssayView.vue')
    },
    {
      path: '/moments',
      name: 'moments',
      component: () => import('../views/ComplaintsView.vue')
    },
    {
      path: '/moment/:id',
      name: 'moment',
      component: () => import('../views/ComplaintDetailView.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/admin/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫，检查管理员权限
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 使用auth.js中的isLoggedIn方法检查登录状态
    if (!isLoggedIn()) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router 