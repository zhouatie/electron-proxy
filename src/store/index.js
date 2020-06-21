import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    requests: []
  },
  getters: {
    getRequests(state) {
      return state.requests.slice(0, 20);
    }
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
