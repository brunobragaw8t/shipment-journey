import PageDashboard from '@/pages/PageDashboard.vue'
import PageProfile from '@/pages/PageProfile.vue'
import PageReports from '@/pages/PageReports.vue'
import PageSettings from '@/pages/PageSettings.vue'
import PageShipments from '@/pages/PageShipments.vue'
import PageShipment from '@/pages/PageShipment.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import LayoutShipments from '@/layouts/LayoutShipments.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: LayoutDefault,
      meta: { breadcrumb: 'Shipment Journey' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: PageDashboard,
          meta: { breadcrumb: 'Dashboard' },
        },
        {
          path: 'shipments',
          component: LayoutShipments,
          meta: { breadcrumb: 'Shipments' },
          children: [
            {
              path: '',
              name: 'shipments',
              component: PageShipments,
            },
            {
              path: ':id',
              name: 'shipment',
              component: PageShipment,
              meta: { breadcrumb: 'Shipment details' },
            },
          ],
        },
        {
          path: 'reports',
          name: 'reports',
          component: PageReports,
          meta: { breadcrumb: 'Reports' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: PageSettings,
          meta: { breadcrumb: 'Settings' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: PageProfile,
          meta: { breadcrumb: 'Profile' },
        },
      ],
    },
  ],
})

export default router
