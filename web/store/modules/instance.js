export default {
  namespaced: true,
  state: {
    status: {
      auth: false,
      world: false,
      api: false,
      socket: false,
    },
    sniffer: [], //@TODO: Voir pour regrouper selon les instances connectées
  },
  mutations: {
    UPDATE_STATUS(state, data) {
      state.status = data;
    },
    UPDATE_SNIFFER(state, sniffer) {
      state.sniffer.push(sniffer);
    },
  },
};
