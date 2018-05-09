const getVueObj = function (vue) {
  const typeNames = { // 声明全局类型描述文本
    msgTyep: {
      '1': '保单信息',
      '2': '理赔信息',
      '3': '身份信息'
    },
    msgStatus: {
      '0': '未授权',
      '10': '已授权',
      '20': '已拒绝',
      '3': '授权超时'
    }
  }
  const filters = []
  // 全局注册自定义过滤器
  filters.map(item => vue.filter(item.name, item.call)) // 在应用中直接通过name使用
  Object.keys(typeNames).map(item => vue.filter(item, function (value) { // 在应用中直接通过typeNames中的对象名使用
    if (typeof value === 'number' || typeof value === 'string') {
      // 如果描述文本中没有匹配的则返回原字符
      return typeNames[item][value.toString().toUpperCase()] || value
    }
    return value
  }))
}

export default getVueObj
