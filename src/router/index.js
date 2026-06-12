import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'ProductListing',
    component: () => import('../views/ProductListing.vue')
  },
  {
    path: '/product/:slug',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.path === from.path) {
      return;
    }
    return { top: 0 };
  }
});

export default router;
