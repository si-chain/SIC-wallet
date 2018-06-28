module.exports = {
  entry: {
    // 这里的依赖顺序必须是：对象从上往下依赖，数组从右到左依赖（如果互不依赖的可以忽略顺序）
    // ui: ['vux'],
    // sic: ['sic-ecies'],
    eostool: ['aes', 'crypto-js'],
    eos: ['eosjs'],
    tool: ['lodash', 'jdenticon', 'js-sha256'],
    vuemoment: ['vue-moment'],
    vuetool: ['vue-i18n', 'vuex-i18n'],
    vuex: ['vuex'],
    router: ['vue-router'],
    vue: ['vue'],
    other: ['fastclick'],
  },
  outFile: '../static/dll'
};

