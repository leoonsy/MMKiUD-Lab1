import { createRouter, createWebHistory } from 'vue-router';
import authStore from '@/store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  strict: true,
  sensitive: true,
  routes: [
    {
      path: '/table',
      name: 'Table',
      component: () => import(/* webpackChunkName: "table" */ '@/pages/Table.vue'),
      alias: '/',
    },
    {
      path: '/objects',
      name: 'Objects',
      component: () => import(/* webpackChunkName: "objects" */ '@/pages/Objects.vue'),
      alias: '/',
    },
    {
      path: '/accounts',
      name: 'Accounts',
      component: () => import(/* webpackChunkName: "accounts" */ '@/pages/Accounts.vue'),
      props: true,
    },
    {
      path: '/rights',
      name: 'Rights',
      component: () => import(/* webpackChunkName: "rights" */ '@/pages/Rights.vue'),
      props: true,
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import(/* webpackChunkName: "signin" */ '@/pages/SignIn.vue'),
      props: true,
      meta: {
        public: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ '@/pages/404.vue'),
      meta: {
        public: true,
      },
    },
  ],
});

const { account } = authStore;

router.beforeEach((to) => {
  if (to.name === 'SignIn' && account.value) {
    return { path: '/' };
  }

  if (to.matched.some(({ meta }) => !meta.public) && !account.value) {
    return { name: 'SignIn' };
  }

  return true;
});

export default router;
