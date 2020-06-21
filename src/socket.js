import io from 'socket.io-client';
import Vue from 'vue';
import store from '@/store';
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('client => connect');
  store.commit('setSocketStatus', true);
});
socket.on('update', (data) => {
  console.log('event', data);
  store.commit('addRequest', data);
});
socket.on('disconnect', function() {
  console.log('disconnect');
});

Vue.prototype.$socket = socket;

console.log('excute');
