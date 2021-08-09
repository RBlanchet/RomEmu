import instance from './modules/instance';

export default ($axios) => ({
  instance: instance($axios),
});
