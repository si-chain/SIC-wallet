/*eslint-disable */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import util from '../libs/utils'

import en from './en-US'
import zh from './zh-CN'

Vue.use(VueI18n)

const messages = {
  'en-US': en,
  'zh-CN': zh
}

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
    }
  },
  'zh-CN': {
    currency: {
      style: 'currency', currency: 'CNY', currencyDisplay: 'symbol'
    }
  }
}

const dateTimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric', hour12: true
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  },
  'zh-CN': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric', hour12: false
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }
  }
}
let locale = util.getStore('_locale') || navigator.language
locale == 'zh' || locale == 'zh-CN' ? locale = 'zh-CN' : locale = 'en-US'
locale = locale.split('-')[0].toLowerCase() + '-' + locale.split('-')[1].toUpperCase()
util.setStore('_locale', locale)

export default new VueI18n({
  locale: locale,
  fallbackLocale: 'zh-CN',
  numberFormats,
  dateTimeFormats,
  messages
})
