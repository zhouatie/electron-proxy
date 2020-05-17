import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    requests: []
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.unshift(payload);
    },
    clear(state) {
      state.requests = [];
    }
  }
});

export default store;
