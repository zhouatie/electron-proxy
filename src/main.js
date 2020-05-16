import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/index.less';
import store from '@/store';

Vue.use(ElementUI);
Vue.config.productionTip = false;

import './socket.js';

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app');
