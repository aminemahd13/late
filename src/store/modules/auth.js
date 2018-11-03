import axios from '@/api';

const state = {
  user: {},
  isAuthenticated: false
};
const getters = {};

const actions = {
  async GET_USER({ dispatch, commit }) {
    try {
      const response = await axios.get('/students/user');
      const user = response.data.user;
      commit('SET_USER', user);
      await dispatch('UPDATE_SCHEDULE');
      await dispatch('GET_UPCOMING_ASSIGNMENTS');
    } catch (e) {
      console.error('Not logged in!');
    }
  }
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
    state.isAuthenticated = true;
  },
  UNSET_USER: state => {
    state.user = {};
    state.isAuthenticated = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
