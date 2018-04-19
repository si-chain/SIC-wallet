import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import createAccount from '../pages/createAccount.vue'
import createAccountSuccess from '../pages/createAccountSuccess.vue'

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
    }
  ]
})
