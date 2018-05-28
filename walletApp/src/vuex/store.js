import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  isLoading: false,
  wallets: [],
  IdentityAccount: [],
  account: '',
  img_upload_cache: [],
  img_paths: [],
  img_status: 'ready',
  index: 0,
  hasMsg: false,
  msgList: []
}
export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    upDataIdentityAccount (state, data) {
      if (state.IdentityAccount.indexOf(data) < 0) {
        state.IdentityAccount.push(data)
      }
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
    },
    setAccount (state, account) {
      state.account = account
    },
    setIndex (state, val) {
      state.index = val
    },
    upDataMsg (state, flag) {
      state.hasMsg = flag
    },
    upDataMsgList (state, item) {
      state.msgList.push(item)
    }
  }
})
