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
// import vueTouchObj from './libs/vueTouch'

/*eslint-disable */
function vueTouch(el, binding, type) {
  var _this = this
  this.obj = el
  this.binding = binding
  this.touchType = type
  this.vueTouches = {
    x: 0,
    y: 0
  }
  this.vueMoves = true
  this.vueLeave = true
  this.longTouch = true
  this.vueCallBack = typeof (binding.value) == "object" ? binding.value.fn : binding.value
  this.obj.addEventListener("touchstart", function (e) {
    _this.start(e)
  }, false)
  this.obj.addEventListener("touchend", function (e) {
    _this.end(e)
  }, false)
  this.obj.addEventListener("touchmove", function (e) {
    _this.move(e)
  }, false)
}
vueTouch.prototype = {
  start: function (e) {
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    }
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType == "longtap" && this.vueCallBack(this.binding.value, e)
        this.longTouch = false
      }
    }.bind(this), 1000)
  },
  end: function (e) {
    var disX = e.changedTouches[0].pageX - this.vueTouches.x
    var disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      this.touchType == "swipe" && this.vueCallBack(this.binding.value, e)
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          this.touchType == "swiperight" && this.vueCallBack(this.binding.value, e)
        }
        if (disX < -10) {
          this.touchType == "swipeleft" && this.vueCallBack(this.binding.value, e)
        }
      } else {
        if (disY > 10) {
          this.touchType == "swipedown" && this.vueCallBack(this.binding.value, e)
        }
        if (disY < -10) {
          this.touchType == "swipeup" && this.vueCallBack(this.binding.value, e)
        }
      }
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType == "tap" && this.vueCallBack(this.binding.value, e)
        this.vueLeave = false
      }
    }
  },
  move: function (e) {
    this.vueMoves = false
  }
}
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

Vue.directive('swipedown', {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipedown')
  }
})
Vue.directive('swipeup', {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swipeup')
  }
})
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
