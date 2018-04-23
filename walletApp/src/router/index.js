import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import createAccount from '../pages/createAccount.vue'
import createAccountSuccess from '../pages/createAccountSuccess.vue'
import accountBackup from '../pages/accountBackup.vue'
import accountBackupDetail from '../pages/accountBackupDetail.vue'
import walletManage from '../pages/walletManage.vue'
import home from '../pages/home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/create-account',
      name: 'createAccount',
      component: createAccount
    },
    {
      path: '/wallet-create-success',
      name: 'createAccountSuccess',
      component: createAccountSuccess
    },
    {
      path: '/wallet-backup',
      name: 'accountBackup',
      component: accountBackup
    },
    {
      path: '/wallet-backup-key',
      name: 'accountBackupKey',
      component: accountBackupDetail
    },
    {
      path: '/wallet-manage',
      name: 'walletManage',
      component: walletManage
    },
    {
      path: '/home',
      name: 'home',
      component: home
    }
  ]
})
