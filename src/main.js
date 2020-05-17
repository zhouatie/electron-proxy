import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/index.less';
import store from '@/store';
// import './socket.js';

const { ipcRenderer } = require('electron');

Vue.use(ElementUI);
Vue.config.productionTip = false;

ipcRenderer.on('info', (a, b) => {
  console.log(a, b, 'ab');
});

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app');
