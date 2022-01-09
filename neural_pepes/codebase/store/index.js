import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: process.client ? window.localStorage : null,
  modules: ['batch']
})

export const plugins = [vuexLocal.plugin]
