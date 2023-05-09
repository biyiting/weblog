import { createStore, createLogger } from 'vuex';


export default createStore({
  modules: {
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
