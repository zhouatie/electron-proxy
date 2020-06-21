import Vue from 'vue';
import VueRouter from 'vue-router';

import Request from '@/views/request/index.vue';
import Rules from '@/views/rules/index.vue';
import Mock from '@/views/mock/index.vue';
import Hosts from '@/views/hosts/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/request',
    name: 'request',
    component: Request
  },
  {
    path: '/rules',
    name: 'rules',
    component: Rules
  },
  {
    path: '/host',
    name: 'host',
    component: Hosts
  },
  {
    path: '/mock',
    name: 'mock',
    component: Mock
  },
  // {
  //   path: '/prod',
  //   name: 'prod',
  //   component: Rules
  // },
  // {
  //   path: '/check',
  //   name: 'check',
  //   component: Rules
  // },
  {
    path: '*',
    redirect: '/request'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
