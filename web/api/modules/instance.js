export default ($axios) => ({
  getStatus: async () => $axios.$get('/api/instances/status'),
  startServer: async (name) => $axios.$post(`/api/instances/start/${name}`),
});
