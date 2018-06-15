/* jshint ignore:start */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './vuex/store'
import { AjaxPlugin, ToastPlugin, ConfirmPlugin, ViewBox } from 'vux'
import i18n from './language/index'
import util from './libs/utils'
import Filters from './libs/filters'
import moment from 'vue-moment'

Vue.component('view-box', ViewBox)
Filters(Vue)
Vue.use(moment)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(ConfirmPlugin)
FastClick.attach(document.body)

Vue.config.productionTip = false
// Vue.prototype.$http.defaults.baseURL = '${this.basePath}/v1'
Vue.prototype.$common = util
// Vue.prototype.basePath = 'http://XXXX.com.cn:XXXX'
Vue.prototype.basePath = 'http://api.sichain.com.cn:3000'

Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
