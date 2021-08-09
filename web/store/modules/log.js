export default {
  namespaced: true,
  state: {
    auth: [],
  },
  mutations: {
    ADD_LOG_AUTH: (state, log) => state.auth.push(log),
  }
};
