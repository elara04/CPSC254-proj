//  new file not part of default
import { createRouter, createWebHistory } from 'vue-router'

// Import views
import DashboardView from '@/views/DashboardView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import CoursesView from '@/views/CoursesView.vue'
import AssetsView from '@/views/AssetsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesView
  },
  {
    path: '/courses',
    name: 'courses',
    component: CoursesView
  },
  {
    path: '/assets',
    name: 'assets',
    component: AssetsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
