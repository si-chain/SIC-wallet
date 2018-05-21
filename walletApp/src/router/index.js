import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/index.vue')
    },
    {
      path: '/create-account',
      name: 'createAccount',
      component: () => import('@/pages/createAccount.vue')
    },
    {
      path: '/wallet-create-success',
      name: 'createAccountSuccess',
      component: () => import('@/pages/createAccountSuccess.vue')
    },
    {
      path: '/wallet-backup',
      name: 'accountBackup',
      component: () => import('@/pages/accountBackup.vue')
    },
    {
      path: '/wallet-backup-key',
      name: 'accountBackupKey',
      component: () => import('@/pages/accountBackupDetail.vue')
    },
    {
      path: '/wallet-manage',
      name: 'walletManage',
      component: () => import('@/pages/walletManage.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/pages/home.vue')
    },
    {
      path: '/policy',
      name: 'Policy',
      component: () => import('@/pages/InsurancePolicy.vue')
    },
    {
      path: '/insurance-policy',
      name: 'insurancePolicy',
      component: () => import('@/pages/InsurancePolicyDetail.vue')
    },
    {
      path: '/insurance-claim',
      name: 'insuranceClaim',
      component: () => import('@/pages/InsurancePolicyDetail.vue')
    },
    {
      path: '/account-import',
      name: 'accountImport',
      component: () => import('@/pages/accountImport.vue')
    },
    {
      path: '/trading-record',
      name: 'TradingRecord',
      component: () => import('@/pages/TradingRecord.vue')
    },
    {
      path: '/create-login',
      name: 'CreateLogin',
      component: () => import('@/pages/createLogin.vue')
    },
    {
      path: '/authorization-record',
      name: 'AuthorizationRecord',
      component: () => import('@/pages/authorizationRecord.vue')
    },
    {
      path: '/transfer',
      name: 'Transfer',
      component: () => import('@/pages/transfer.vue')
    },
    {
      path: '/transfer-detail',
      name: 'TransferDetail',
      component: () => import('@/pages/transferDetail.vue')
    },
    {
      path: '/guidance',
      name: 'guidance',
      component: () => import('@/pages/guidance.vue')
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: () => import('@/pages/agreement.vue')
    },
    {
      path: '/user-agreement',
      name: 'user-agreement',
      component: () => import('@/pages/agreement.vue')
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import('@/pages/withdraw.vue')
    }
  ]
})
