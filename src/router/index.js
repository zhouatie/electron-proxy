import Vue from 'vue';
import VueRouter from 'vue-router';

import Request from '@/views/request/index.vue';
import Rules from '@/views/rules/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/request',
    name: 'request',
    component: Request,
  },
  {
    path: '/rules',
    name: 'rules',
    component: Rules,
  },
  {
    path: '*',
    redirect: '/request',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
