# web project 通过webpack 打包问题


## 思路：vendor.js的产生以及依赖关系

vendor主要是根据项目本身的一下依赖包，去确立build时需要那些js，然后将项目中需要的js&nbsp; build成一个js文件

所以会导致出现vendor.js文件过大的问题

## 方案：通过项目依赖包 生成不同的js 然后让html去同时加载多个js（大大减少首屏渲染时间）

通过webpack的DllPlugin插件和HtmlWebpackPlugin插件去实现

* 先将build的入口文件进行拆分

  拆分成对象数组的形式，根据不同的功能进行分类

  例：
  ```
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
  ```
  * 新建dll配置文件 `webpack.dll.conf.js`

  ```
      /**
      * webpack通过dll抽离模块打包
      * 将静态资源文件（运行依赖包）与源文件分开打包，先使用DllPlugin给静态资源打包，再使用DllReferencePlugin让源文件引用资源文件。
      * 并且根据配置动态输出chunk
      */
      var ora = require('ora');
      var path = require("path");
      var webpack = require("webpack");
      var config = require('../config');
      var dllConfig = require('../config/dll');
      var HtmlWebpackPlugin = require('html-webpack-plugin');

      function resolve(dir) {
        return path.join(__dirname, '..', dir)
      }
      module.exports = {
        // 想要打包的模块的数组
        entry: dllConfig.entry,
        output: {
          path: path.join(__dirname, dllConfig.outFile), // 打包后文件输出的位置
          filename: '[name].dll.[chunkhash].js',
          library: '[name]_library'
          // 主要是给DllPlugin中的name使用，
          // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
        },
        resolve: {
          extensions: ['.js', '.vue', '.json'],
          alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
          }
        },
        plugins: [
          new webpack.DllPlugin({
            // 输出依赖关系
            path: path.join(__dirname, dllConfig.outFile, '[name]_manifest.json'),
            name: '[name]_library',
            context: __dirname
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          }),
          // 通过模版文件动态输出chunk并生成html文件
          new HtmlWebpackPlugin({
            filename: path.join(__dirname, '../', 'index.html'),
            template: 'index.ejs',
            inject: false
          })
        ]
      };
  ```

  HtmlWebpackPlugin插件需要配合模版语言去实现动态的根据build的文件去在index.html中生成对应script标签
  所以需要在项目的根目录下新建一个index.ejs模版语言

  代码如下（根据各自项目不同的需求可进行相应的改动）
  ```
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui,viewport-fit=cover">
      <meta name="apple-mobile-web-app-capable" ,content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" ,content="black">
      <meta name="format-detection" ,content="telephone=no">
      <meta name="description" ,content="Mobile wallet for SIC">
      <title>wallet</title>
    </head>

    <body>
      <script type="text/javascript" src="cordova.js"></script>
      <script type="text/javascript" src="static/js/index.js"></script>

      <!-- <script type="text/javascript" src="./static/cordova.js"></script> -->
      <div id="app-box"></div>
      <% for (var chunk in htmlWebpackPlugin.files.chunks) { %><script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
      <% } %>
      <!-- built files will be auto injected -->

    </body>

  </html>

  ```

  ## 最后需要在package.json里面添加dll 的执行命令
  `"dll": "webpack --config build/webpack.dll.conf.js",`

  <span style="color:red">
    需要注意的是在项目dev之前需要先执行dll操作，当项目中配置的 dllConfig.entry 需要进行改动是也需要重新执行dll指令，
    当项目在build的之前执行了dev指令则不需要执行dll操作
  </span>
  <span style="color:red">
  另外需要注意的是文件路径问题一定要去配置正确，不然开发环境可能是正常的，生产环境可能会出现问题！！！
  </span>
  亲测有效
