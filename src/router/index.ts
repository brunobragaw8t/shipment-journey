import PageDashboard from '@/pages/PageDashboard.vue'
import PageProfile from '@/pages/PageProfile.vue'
import PageReports from '@/pages/PageReports.vue'
import PageSettings from '@/pages/PageSettings.vue'
import PageShipments from '@/pages/PageShipments.vue'
import PageShipment from '@/pages/PageShipment.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: PageDashboard,
    },
    {
      path: '/shipments',
      name: 'shipments',
      component: PageShipments,
    },
    {
      path: '/shipments/:id',
      name: 'shipment',
      component: PageShipment,
    },
    {
      path: '/reports',
      name: 'reports',
      component: PageReports,
    },
    {
      path: '/profile',
      name: 'profile',
      component: PageProfile,
    },
    {
      path: '/settings',
      name: 'settings',
      component: PageSettings,
    },
  ],
})

export default router
