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
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var spinner = ora('building for production...').start();

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
      filename: path.join(__dirname, '../', config.dev.index),
      template: 'index.ejs',
      inject: false
    }),
    new NyanProgressPlugin({
      logger: function () {
      },
      getProgressMessage: function (progress, messages, styles) {
        spinner.text = '进度:' + (progress * 100).toFixed(2) + '%' + '  ' + messages[0] || messages[1];
        if (progress == 1) {
          console.log('\n进度:' + (progress * 100).toFixed(2) + '%', messages[0] || messages[1]);
          spinner.stop();
        }
      },
      restoreCursorPosition: true,
    })
  ]
};
