module.exports = {
  entry: {
    // 这里的依赖顺序必须是：对象从上往下依赖，数组从右到左依赖（如果互不依赖的可以忽略顺序）
    // ui: ['vux'],
    tool: ['lodash'],
    vue: ['vue', 'vuex', 'vue-router', 'vue-i18n'],
    other: ['fastclick'],
  },
  outFile: '../static/dll'
};

