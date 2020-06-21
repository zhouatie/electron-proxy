import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/index.less';
import store from '@/store';
import { setupElectron, setupIpcRenderer } from './setup';
// import './socket.js';

Vue.use(setupElectron);
Vue.use(setupIpcRenderer);

Vue.use(ElementUI, {
  size: 'mini'
});
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app');
