import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  isLoading: false,
  wallets: [],
  img_upload_cache: [],
  img_paths: [],
  img_status: 'ready'
}
export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    UPDATE_WALLETS (state, wallets) {
      state.wallets = wallets
    },
    BACKUPWALLET (state, index) {
      state.wallets[index].isBackup = true
    },
    set_img_upload_cache (state, arg) {
      state.img_upload_cache = arg
    },
    set_img_paths (state, arg) {
      state.img_paths = arg
    },
    set_img_status (state, arg) {
      state.img_status = arg
    }
  }
})
