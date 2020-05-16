import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    socketStatus: false,
    requests: []
  },
  mutations: {
    setSocketStatus(state, payload) {
      state.socketStatus = payload;
    },
    addRequest(state, payload) {
      state.requests.unshift(payload);
    }
  }
});

export default store;
